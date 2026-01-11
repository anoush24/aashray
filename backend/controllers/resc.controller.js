let {RescMod} = require('../models/resc.model')
let {HospMod} = require('../models/hospital.model')
let {locnDecoder} = require('../middlewares/locnDecoder')
let {ReqRescMod} = require('../models/reqResc.model')
let cloudinary = require('cloudinary').v2
let {CloudinaryStorage} = require('multer-storage-cloudinary')

const genRequest = async (req, res) => {
    try {
        let gmap = req.body.gmap
        let match = await locnDecoder(gmap)        
        if (!match) return res.status(400).json({message: 'Invalid Location'})

        let userLng = parseFloat(match[2])
        let userLat = parseFloat(match[1])

        // Find top 4 nearest hospitals
        let topThree = await HospMod.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLng, userLat]
                    }
                }
            }
        }).limit(4)
        
        console.log('Found hospitals:', topThree)

        // ✅ Create and save rescue request
        let newResc = new RescMod({
            requestedBy: req.user.username,
            acceptedBy: null,
            gmap: req.body.gmap,
            location: {
                type: 'Point',
                coordinates: [userLng, userLat]
            },
            file_url: req.file.path,
            file_name: req.file.filename,
        })
        
        let newRescData = await newResc.save()  // ✅ Single try-catch handles this
        console.log('Rescue saved:', newRescData)

        // ✅ Save requests to all hospitals
        let savedRequests = []
        
        for (let hosp of topThree) {
            let newReq = new ReqRescMod({
                requestedBy: req.user.username,
                gmap: req.body.gmap,
                location: {
                    type: 'Point',
                    coordinates: [userLng, userLat]
                },
                requestedTo: hosp._id
            })
            
            let newReqdata = await newReq.save()
            let responseObj = newReqdata.toObject(); 
            responseObj.hospitalName = hosp.username;
            savedRequests.push(responseObj)
            console.log('Request saved for hospital:', hosp._id)
        }

        // ✅ Send response once after all saves
        res.json({
            message: 'Rescue request created and sent to hospitals',
            rescueData: newRescData,
            hospitalRequests: savedRequests,
            totalHospitals: savedRequests.length
        })
        
    } catch (err) {
        console.log('Error in genRequest:', err)
        res.status(500).json({message: err.message})
    }
}
//------------------------------------------------------------------------------------------------------------------------
const sameAnimal = async(req,res)=>{
    let gmap = req.body.gmap
    let match = await locnDecoder(gmap)
    if(!match) return res.status(400).json({message: 'Invalid Location'})

    let maxRadius = 500//metres
    let userLng = parseFloat(match[2])
    let userLat = parseFloat(match[1])
    try{

    let nearBy = await RescMod.find({
        location:{
            $near:{
                $geometry:{
                    type: 'Point',
                    coordinates:[userLng,userLat]
                },
                $maxDistance:maxRadius
            }
        }
    })
        if(nearBy.length>0) {
            let images = nearBy.map(sample=>{
                return sample.file_url
            })
            res.json({
                message:"Animals from same location",
                data :images
            })
        }
        else{
            res.json({
                message:"confirm?",
                data:req.body 
            })
        }
    
}catch(err){
    console.log(err)
    res.send(err)
}
}
//----------------------------------------------------------------------------------------------------------
// Get all requests made by the logged-in user
const getHistory = async (req, res) => {
    try {
        // Find requests where 'requestedBy' matches the logged-in username
        // Sort by requestTime descending (newest first)
        const history = await RescMod.find({ requestedBy: req.user.username })
                                     .sort({ requestTime: -1 });
        
        res.json({
            message: "User rescue history",
            data: history,
            count: history.length
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

// Don't forget to export it: module.exports = { ..., getHistory }
//----------------------------------------------------------------------------------------------------------

const deleteReq = async (req, res) => {
    try {
        // ✅ 1. Get the ID from the request body (sent from frontend)
        const { id } = req.body; 

        if (!id) {
            return res.status(400).send('Request ID is required');
        }

        // ✅ 2. Find the specific rescue request by its unique _id
        const rescData = await RescMod.findById(id);

        if (!rescData) {
            return res.status(404).send('Record not found');
        }

        // ✅ 3. Verify ownership (Optional but Recommended)
        // Ensure the person deleting it is the one who created it
        if (rescData.requestedBy !== req.user.username) {
             return res.status(403).send('Unauthorized to delete this request');
        }

        // ✅ 4. Delete file from Cloudinary
        if (rescData.file_name) {
            await cloudinary.uploader.destroy(rescData.file_name);
        }

        // ✅ 5. Delete the specific record from Database
        await RescMod.findByIdAndDelete(id);

        // (Optional) If ReqRescMod is linked by ID, delete specific logs here.
        // If not, be careful with 'deleteMany' as it might wipe user history.
        // For now, we only delete the main Rescue Record.

        res.send('Request deleted successfully');

    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports={genRequest,sameAnimal,deleteReq,getHistory}
const {PetModel} = require("../models/pet.model")
const cloudinary = require('cloudinary').v2
const fs = require("fs")

const addOwnPet = async(req,res) => {
    try {
        const user = req.user
        if(!user) {
            return res.status(404).json({message:"user not found"})
        }

        const {name,species,breed,age,gender,weight,description,medicalNotes,isVaccinated,isNeutered} = req.body;
        let file_name=""
        let file_url=""

        if(req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "aashray_pets",
                    width:500,
                    crop:"scale"
                })

                file_url = result.secure_url
                file_name = req.file.originalname

                fs.unlinkSync(req.file.path)
            }
            catch(err)
            {
                console.error("Cloudinary Upload Error:", err)
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const newPet = new PetModel({
            owner_id:user._id,
            owner_name:user.username,
            email:user.email,
            owner_type:"Individual",
            contactNumber:user.contactNumber || "",
            name,
            species,
            breed,
            age,
            gender,
            file_url,
            file_name,
            status:"Owned",
            weight,
            description,
            vaccinations: [],
            medicalHistory: [],
            
        });

        const savedPet = await newPet.save();

        const response = {success:true,message:"pet added successfully",pet:savedPet}

        if(req.access) {
            response.newAccessToken = req.access;
        }
        res.status(200).json(response)
    }
    catch(err) {
        console.error("Error adding pet:", err);
        res.status(500).json({success:false,message:"server error adding pet"})
    }
}


const getMyPets = async(req,res) => {
    try {
        const user = req.user
        const pets = await PetModel.find({
            owner_id:user._id,
            status:"Owned"
        }).sort({createdAt:-1})
        res.status(200).json({ success: true, pets });
    }
    catch(err) {
        console.error("Error fetching pets:",err)
        res.status(500).json({ success: false, message: "Server error fetching pets" });
    } 
}


module.exports = {addOwnPet,getMyPets};
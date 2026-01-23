const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()

const {UserModel} = require('../models/user.model')
const {HospMod} = require("../models/hospital.model.js")
const {SlotModel} = require("../models/slot.model.js")
const {AppointmentModel} = require("../models/appointment.model.js")

let {locnDecoder} = require('../middlewares/locnDecoder.js')
let {genAccessToken,genRefreshToken} = require('../middlewares/generateToken.js')


 let crypter = async (password) =>{
    const salt = await bcrypt.genSalt(11)
    let hash = await bcrypt.hash(password,salt)
    return hash
 }
 
 //newUser---------------------------------------------------------------

 let signUpNewUser = async (req,res)=>{
    let {username,password,email,contactNumber,gmap} = req.body

    const exists = await UserModel.findOne({username});

    if(exists) {
      return res.status(400).json({message:"Username is already used"})
    }

    let match = await locnDecoder(gmap)    
    if(!match) return res.json({message:'Invalid link'}) 
    
    let location = {
        type:'Point',
        coordinates:[parseFloat(match[2]),parseFloat(match[1])]
    }

    try{
    let hashedPass = await crypter(password)

    const newUser = new UserModel({
        username ,
        password: hashedPass ,
        email, contactNumber,
        gmap,location
    })

    let result = await newUser.save()
    console.log(result)

    let payload = {
        _id: result._id,
        username:result.username,
        role:"user",
        isSeller: result.isSeller

    }

    let accessToken = await genAccessToken(payload)
    let refreshToken = await genRefreshToken(payload)

    res.cookie('refreshToken',refreshToken,{
        httpOnly:false, 
        secure:false, //true in productn
        maxAge: 7*24*60*60*1000,
        sameSite:'lax' 
    })
    try{

            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use Gmail service
                auth: {
                  user: 'aashray43@gmail.com', // Your email
                  pass: 'ugyh baxz cnmo dcyk' // Your app password
                },
                tls: {
                  rejectUnauthorized: false
                }
              });

              const mailOptions = {
                from: 'aashray43@gmail.com', // Sender address
                to: email, // Receiver address
                subject: 'Signup Confirmation', // Subject
                text: `You have successfully signedup for Aashray ,${username}\n\nBest Regards,\nTeam Aashray`
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                  return res.status(500).send('Error sending email');
                } else {
                  console.log('Email sent: ' + info.response);
                  res.json({accessToken,refreshToken})
                }
              });
              // res.json({accessToken,refreshToken})
            } catch (err) {
              console.error('Error saving data:', err);
              return res.status(500).send('Error saving data');
           }
        }catch(err){
            return console.log(err)
    }
    console.log(`NEW USER REGISTERED ${username}`)
 }

//login---------------------------------------------------------------
const login = async (req, res) =>{
    let {username,password} = req.body
    try{
        let loginUser = await UserModel.findOne({username})
        if(!loginUser){
            return res.json({
                "message":"User Not Found"
            })
        }

        let isValidPass = await bcrypt.compare(password,loginUser.password)
        if(!isValidPass){
            return res.json({"message":"Incorrect Password"})
        }

        let payload = {
            _id: loginUser._id,
            username:loginUser.username,
            role:"user",
            isBlogger:loginUser.isBlogger,
            isSeller: loginUser.isSeller
        }
        let accessToken = await genAccessToken(payload)
        let refreshToken = await genRefreshToken(payload)

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true, 
            secure:false, //true in productn
            maxAge: 7*24*60*60*1000, // expires in 7 days
            sameSite:'lax' // same site access and top urls access
        })

        res.json({
            "message":"Login Successfull",
            "accessToken":accessToken,
            "user": payload
        })

    }catch(err){
        console.error(err)
        res.json({
            "message":"Error",
            "error":err

        })
    }
}

const handleRefresh = async(req,res) => {
    const token = req.cookies.refreshToken;
    
    if(!token) {
        return res.status(401).json({message:"refresh token missing"})
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_SECRET
      )
      let foundUser;

      if(decoded.role === "hospital") {
        foundUser = await HospMod.findById(decoded._id)
      }
      else if(decoded.role === "user") {
        foundUser = await UserModel.findById(decoded._id)
      }

      if(!foundUser) return res.status(400).json({message:"User not found"})

      const payload = {
        _id:foundUser._id,
        username:foundUser.username,
        role:foundUser.role,
        isBlogger:foundUser.isBlogger || false,
        isSeller: foundUser.isSeller || false
      }
      const accessToken = genAccessToken(payload)
      res.json({accessToken,user:payload})
    }
    catch(err) {
        console.log("Refresh Error:", err.message)
        return res.status(403).json({message:"invalid refresh token"})
    }

}

const logout = (req,res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
  return res.status(200).json({ message: "Logout successful" });
}



//delete------------------------------------------------------------------
const deleteAcc = (req,res)=>{
    const userId = req.user._id
    UserModel.findByIdAndDelete(userId)
    .then(()=>{
        res.send('Account deleted')
    })
    .catch((err)=>{
        console.log('Error in deleting acc',err)
        res.send('Error in deleting account')
    })
}

//update------------------------------------------------------------
const updateAcc = (req,res)=>{
    userId = req.user._id
    let updates = req.body
    console.log(updates)

    UserModel.findByIdAndUpdate(userId,
        {
            $set : updates // updates is a json object which contains parameterToBeUpdates:Value
        },{
        new:true,
        runValidators:true
    })
    .then((result)=>{
        res.send(result)
        console.log(`Updates ${result}`)
    })
    .catch((err)=>console.log(err))
}
//--------------------getCurrUser--------------------------------------------

const getCurrentUser = async (req, res) => {
  try {
    const userData = req.user
    console.log("User Data : ",userData);

    const userId = userData.id;
    const user =await UserModel.findById(userId);

    res.status(200).json({user})
  } 
  catch(err) {
    console.log(err)
    return res.status(500).json({message:"server error"})
    }
}

//-------------tophospNearme------------------------
const nearByHosp = async (req, res) =>{
    try{
        
        const [userLng ,userLat] = req.user.location.coordinates;

        let topThree = await HospMod.find({
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates:[userLng,userLat]
                    }
                }
            }
        }).limit(5)
        res.json({hospitals:topThree , userLocation: {lat: userLat,lng: userLng}})
        console.log(topThree)

    }catch(err){
        res.status(500).json({message: err.message})
        console.log(err)
    }
}
//-----bookSlot---------------------------------------------------------------------------

const bookSlot = async (req, res) => {
    try {

        const { slot_id, pet_id, reason } = req.body;
        const user_id = req.user._id;

        if (!slot_id || !pet_id) {
            return res.status(400).json({ message: "Slot ID and Pet ID are required" });
        }

        const lockedSlot = await SlotModel.findOneAndUpdate(
            { 
                _id: slot_id, 
                isBooked: false 
            },
            { 
                $set: { isBooked: true } 
            },
            { new: true } 
        );

        if (!lockedSlot) {
            return res.status(409).json({ message: "This slot is no longer available." });
        }

        const appointmentDate = new Date(
            lockedSlot.startTime.getFullYear(),
            lockedSlot.startTime.getMonth(),
            lockedSlot.startTime.getDate()
        )

        const newAppointment = new AppointmentModel({
            hospital_id: lockedSlot.hospital_id,
            slot_id: lockedSlot._id,
            pet_id: pet_id,
            owner_id: user_id,
            appointmentDate,
            reason: reason || "General Checkup",
            status: "Scheduled"
        });

        await newAppointment.save();

        res.status(200).json({ 
            success: true, 
            message: "Booking confirmed", 
            appointment: newAppointment 
        });

    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ message: "Error processing booking" });
    }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await AppointmentModel.find({ owner_id: userId })
      .populate("hospital_id", "username address contactNumber")
      .populate("pet_id", "name image")
      .populate("slot_id", "startTime endTime");
      
    appointments.sort((a, b) => {
        const dateA = new Date(a.slot_id.startTime);
        const dateB = new Date(b.slot_id.startTime);
        return dateA - dateB; 
    });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};


//----------------anoushkaController---------------------
const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};
module.exports={signUpNewUser,login,deleteAcc,updateAcc,getCurrentUser,nearByHosp,bookSlot,getUserProfile,getMyAppointments,handleRefresh,logout}
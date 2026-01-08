const express = require('express');
const petRouter = express.Router();
const { userAuth } = require('../middlewares/userAuth');
const { addOwnPet,getMyPets } = require('../controllers/pet.controller');
const multer = require("multer")

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

petRouter.post('/add-my-pet', userAuth,upload.single("image"),addOwnPet);
petRouter.get('/my-pets',userAuth,getMyPets);

module.exports = petRouter;
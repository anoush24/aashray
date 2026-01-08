const nodemailer = require('nodemailer');
// UPDATE: Import the new PetModel (make sure the path matches your project structure)
const { PetModel } = require('../models/pet.model'); 

//----------------- Want To Adopt -----------------------------
const wantToAdopt = async (req, res) => {
    const _id = req.body.animalId;
    const user = req.user; // Assumes your auth middleware attaches 'user' to req

    try {
        // UPDATE: Use PetModel to find the pet
        let wantedPet = await PetModel.findById(_id);

        // OPTIONAL: Check if pet is actually available
        if (wantedPet && wantedPet.status === 'Available') { 
            
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'aashray43@gmail.com',
                    pass: 'ugyh baxz cnmo dcyk' // Ideally, use environment variables for this!
                }
            });

            // UPDATE: The email field is at the root level in your new schema, so this works perfectly.
            const mailOptions = {
                from: 'aashray43@gmail.com',
                to: user.email,
                subject: 'Contact Information for adoption',
                text: `Contact information for the owner of ${wantedPet.name} (${wantedPet.species}):\n\nOwner Name: ${wantedPet.owner_name}\nEmail: ${wantedPet.email}\nPhone: ${wantedPet.contactNumber || 'Not provided'}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({
                        "message": "Owner details sent to your email",
                        "emailResponse": info.response
                    });
                }
            });
        } else {
            res.status(404).json({ "error": "Pet not found or not available for adoption." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": err.message });
    }
}

//----------------- getPets (Adoption Feed) -----------------------------
const getAllPets = async (req, res) => {
    try {
        // UPDATE: We add a filter { status: 'Available' }
        // This ensures users don't see pets that are just stored in the dashboard ('Owned') or already 'Adopted'.
        let allPets = await PetModel.find({ status: 'Available' });

        if (allPets) {
            console.log(`Found ${allPets.length} available pets.`);
            res.json({
                "List of all available pets": allPets
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": err.message });
    }
}

module.exports = { getAllPets, wantToAdopt };
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  // --- 1. LINK TO USER ACCOUNT ---
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },

  // --- 2. CONTACT DETAILS  ---
  // We keep these for the Adoption Listing display.
  owner_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
    // REMOVED 'unique: true' -> One owner can now have multiple pets
  },
  owner_type: { 
    type: String,
    enum: ['NGO', 'Pet_Store', 'Individual'],
    default: 'Individual',
    required: true,
  },
  contactNumber: { type: String },

  // --- 3. PET DETAILS ---
  name: { type: String, required: true },
  species: { type: String, required: true }, // e.g., Dog, Cat
  breed: String,
  age: Number,
  gender: String,
  
  // --- 4. MEDIA  ---
  file_name: { type: String },
  file_url: { type: String }, // The image shown on Dashboard and Adoption Feed

  // --- 5. THE STATUS SWITCH ---
  status: {
    type: String,
    enum: ['Owned', 'Available', 'Adopted'], 
    default: 'Owned'
  },
  
  // Only relevant if status === 'Available'
  description: String, 

  // --- 6. MEDICAL DATA (For Appointments Tab) ---
  weight: Number,
  vaccinations: [{
    name: String, 
    dateAdministered: Date,
    nextDueDate: Date
  }],
  medicalHistory: [{
     condition: String,
     date: Date,
     vetNotes: String
  }]

}, {
  timestamps: true
});

const PetModel = mongoose.model('Pet', petSchema);
module.exports = { PetModel };
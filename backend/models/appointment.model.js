const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true
  },
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HospMod',
    required: true
  },
  slot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },

  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'NoShow'],
    default: 'Scheduled'
  },
  
  reason: {
    type: String, 
    required: true 
  },

  // PRESCRIPTION / OUTCOME (Filled by Doctor) ---
  diagnosis: { type: String },
  medicines: { type: String },
  notes: { type: String },

}, { timestamps: true });

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
module.exports = { AppointmentModel };
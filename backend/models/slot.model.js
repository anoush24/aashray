const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HospMod',
    required: true,
    index: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

slotSchema.index({ hospital_id: 1, startTime: 1 }, { unique: true });

const SlotModel = mongoose.model('Slot', slotSchema);
module.exports = { SlotModel };
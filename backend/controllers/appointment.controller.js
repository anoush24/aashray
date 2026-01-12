const { AppointmentModel } = require('../models/appointment.model');
const { PetModel } = require('../models/pet.model');
const { SlotModel } = require('../models/slot.model');

const getUpcomingAppointments = async (req, res) => {
    try {
        const hospital_id = req.user._id;

        const appointments = await AppointmentModel.find({
            hospital_id: hospital_id,
            status: 'Scheduled'
        })

        .populate({
            path: 'pet_id',
            select: 'name species breed age gender owner_name contactNumber file_url' 
        })

        .populate({
            path: 'slot_id',
            select: 'startTime endTime'
        })

        .sort({ 'slot_id.startTime': 1 }); 
        // appointments.sort((a, b) => new Date(a.slot_id.startTime) - new Date(b.slot_id.startTime));

        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};


const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { diagnosis, medicines, notes } = req.body;
        const hospital_id = req.user._id;

        const appointment = await AppointmentModel.findOne({ 
            _id: id, 
            hospital_id: hospital_id 
        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status !== 'Scheduled') {
            return res.status(400).json({ message: "This appointment is already completed or cancelled." });
        }

        appointment.status = 'Completed';
        appointment.diagnosis = diagnosis;
        appointment.medicines = medicines;
        appointment.notes = notes;
        await appointment.save();

        await PetModel.findByIdAndUpdate(appointment.pet_id, {
            $push: {
                medicalHistory: {
                    condition: diagnosis,
                    date: new Date(),
                    vetNotes: `${medicines} (Notes: ${notes || 'None'})`
                }
            }
        });

        res.status(200).json({ message: "Visit completed & records updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error completing appointment" });
    }
};

module.exports = { getUpcomingAppointments, completeAppointment };
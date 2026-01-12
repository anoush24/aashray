const {SlotModel} = require('../models/slot.model')

const getHospitalSlots = async(req,res) => {
    try {
        const {date} = req.query;
        const hospital_id = req.user._id

        const queryDate = date? new Date(date):new Date();
        const start = new Date(queryDate)
        start.setHours(0,0,0,0)
        const end = new Date(queryDate)
        end.setHours(23,59,59,999) 

        const slots = await SlotModel.find({
            hospital_id: hospital_id,
            startTime: {$gte:start, $lte:end},
            isBooked: false
        }).sort({startTime:1})

        res.status(200).json(slots)
    }
    catch(err) {
        console.error(err)
        res.status(500).json({message:"Error fetching slots"})
    }
}

const addSlot = async(req,res) => {
    try {   
        const {startTime,duration} = req.body
        const hospital_id = req.user._id
        if(!startTime || !duration) {
            return res.status(400).json({message:"Start time and duration is required"})
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration*60000)

        if (start < new Date()) {
            return res.status(400).json({ message: "Cannot create slots in the past." });
        }

        if(start>=end) {
            return res.status(400).json({message:"Invalid duration"})
        }

        const conflict = await SlotModel.findOne({
            hospital_id:hospital_id,
            $or: [
                {
                    startTime: {$lt:end},
                    endTime: {$gt:start }
                }
            ]
        })

        if(conflict) {
            return res.status(409).json({message:`Time clash! Doctor is busy from ${new Date(conflict.startTime).toLocaleTimeString()} to ${new Date(conflict.endTime).toLocaleTimeString()}`,
            conflict: conflict
            })
        }

        const newSlot = await SlotModel.create({
            hospital_id,
            startTime:start,
            endTime:end,
            isBooked:false
        })

        res.status(201).json({message:"Slot created successfully" , slot:newSlot})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({message:"Error adding slot"})
    }
}

const generateBulkSlots = async(req,res) => {
    try {
        const {date,startTime,endTime,interval=30} = req.body
        const hospital_id = req.user._id

        if(!date || !startTime || !endTime) {
            return res.status(400).json({message:"Date, Start Time and End Time are required"})
        }

        const dayStart = new Date(date)
        dayStart.setHours(0,0,0,0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23,59,59,999)

        const existingSlots = await SlotModel.find({
            hospital_id,
            startTime: {$gte:dayStart, $lte:dayEnd}
        })

        const parseTime = (timeStr) => {
            const [h, m] = timeStr.split(':');
            const d = new Date(date);
            d.setHours(parseInt(h), parseInt(m), 0, 0);
            return d;
        };

        let currentStart = parseTime(startTime);
        const globalEnd = parseTime(endTime);
        const slotsToInsert = [];
        let skippedCount = 0;

        const now = new Date();

        while(currentStart<globalEnd)
        {
            const currentEnd = new Date(currentStart.getTime() + interval*60000)
            if(currentEnd>globalEnd) break;

            if (currentStart < now) {
                skippedCount++;
                currentStart = currentEnd;
                continue;
            }

            const hasConflict = existingSlots.some(existing => {
                return (existing.startTime < currentEnd) && (existing.endTime > currentStart);
            })

            if(!hasConflict) {
                slotsToInsert.push({
                    hospital_id,
                    startTime: new Date(currentStart),
                    endTime: currentEnd,
                    isBooked: false
                })
            } else {
                skippedCount++;
            }
            currentStart = currentEnd
        }

        if(slotsToInsert.length>0)
        {
            await SlotModel.insertMany(slotsToInsert)
        }

        res.status(201).json({
            message:`Process complete. Generated ${slotsToInsert.length} slots. Skipped ${skippedCount} due to overlaps.`,
            count: slotsToInsert.length,
            skipped: skippedCount
        })
    }
    catch(err)
    {
        console.error(err)
        res.status(500).json({message:"Error creating bulk slots"})
    }
}

const deleteSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const hospital_id = req.user._id;

        const slot = await SlotModel.findOne({ _id: slotId, hospital_id: hospital_id });

        if (!slot) return res.status(404).json({ message: "Slot not found" });

        if (slot.isBooked) {
            return res.status(403).json({ message: "Cannot delete a slot that is already booked" });
        }

        await slot.deleteOne();
        res.status(200).json({ message: "Slot deleted successfully" });

    } catch (err) {
        console.error("Error in deleteSlot:", err);
        res.status(500).json({ message: "Error deleting slot"});
    }
};

const getWeekSlots = async (req, res) => {
    try {
        const { hospitalId } = req.query;

        if (!hospitalId) {
            return res.status(400).json({ message: "Hospital ID is required" });
        }

        // Start today
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        // Next 7 days
        const end = new Date();
        end.setDate(start.getDate() + 7);
        end.setHours(23, 59, 59, 999);

        const slots = await SlotModel.find({
            hospital_id: hospitalId,
            startTime: { $gte: start, $lte: end },
            isBooked: false
        }).sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            days: 7,
            slots
        });

    } catch (err) {
        console.error("Slot Error:", err);
        res.status(500).json({ message: "Error fetching weekly slots" });
    }
};


module.exports = {
    getHospitalSlots,
    addSlot,
    generateBulkSlots,
    deleteSlot,
    getWeekSlots
}
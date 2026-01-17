import { AppointmentModel } from "../models/appointment.model.js";

export const markNoShowAppointments = async() => {
    try {
        const today = new Date()
        today.setHours(0,0,0,0)

        const result = await AppointmentModel.updateMany(
            {
                status: "Scheduled",
                appointmentDate: {$lt:today}
            },
            { status : "NoShow"}
        )
        console.log(`[CRON] NoShow updated: ${result.modifiedCount}`);
    }
    catch(err) {
        console.error("[Cron] NoShow job failed")
    }

}
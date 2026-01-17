const cron = require("node-cron");
const { markNoShowAppointments } = require("./jobs/noShowJob");

cron.schedule("5 0 * * *", async() => {
    console.log("[Cron] Running noShow Job")
    await markNoShowAppointments();
})
const express = require("express");
const { signUpNewHosp,login,getHosp,getHospitalByID,deleteAcc,updateAcc } = require("../controllers/hosp.controller.js");
const { acceptReq,updateStatus } = require("../controllers/reqresc.controller.js")
const { HospAuth } = require("../middlewares/hospAuth.js");
const { getHospitalSlots,addSlot,generateBulkSlots,deleteSlot} = require("../controllers/slot.controller.js")
const { getUpcomingAppointments,completeAppointment} = require("../controllers/appointment.controller.js")


const hospRouter = express.Router();

hospRouter.post('/register',signUpNewHosp);
hospRouter.post('/login',login);
hospRouter.get('/me',HospAuth,getHosp);
hospRouter.delete('/deleteHosp',HospAuth,deleteAcc)
hospRouter.patch('/hospUpdateAcc',HospAuth,updateAcc)

hospRouter.post('/acceptReq',HospAuth,acceptReq)
hospRouter.post('/updateStatus',HospAuth,updateStatus)

hospRouter.get('/slots', HospAuth, getHospitalSlots);
hospRouter.post('/slots', HospAuth, addSlot);
hospRouter.post('/slots/bulk', HospAuth, generateBulkSlots);
hospRouter.delete('/slots/:slotId', HospAuth, deleteSlot);

hospRouter.get('/appointments/upcoming', HospAuth, getUpcomingAppointments);
hospRouter.post('/appointments/:id/complete', HospAuth, completeAppointment);

hospRouter.get('/:id',getHospitalByID);

module.exports = hospRouter

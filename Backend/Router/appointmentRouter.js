import express from "express"
import { deleteAppointment, postAppointment, showAllAppointments, updateAppointmentStatus } from "../Controller/appointmentController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../Middleware/auth.js";
const router = express.Router();
router.post("/postAppointment", isUserAuthenticated, postAppointment);
router.get("/allAppointments", isAdminAuthenticated, showAllAppointments);
router.post("/updateAppointment/:id", isAdminAuthenticated, updateAppointmentStatus);
router.post("/deleteAppointment/:id", isAdminAuthenticated, deleteAppointment);
export default router;

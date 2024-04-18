import express from 'express';
import { patientRegister, login, addNewAdmin, getAllDoctors, getUserDetails, getAdminDetails, logoutAdmin, logoutUser, addDoctor } from "../Controller/userController.js"
import asyncAwaitErrors from "../Middleware/asyncAwaitErrors.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../Middleware/auth.js";

const router = express.Router();
router.post("/patient/register", asyncAwaitErrors(patientRegister));  // router for registration
router.post("/login", asyncAwaitErrors(login));//router for login (it is same for admin and patient )
router.post("/admin/register", asyncAwaitErrors(isAdminAuthenticated), asyncAwaitErrors(addNewAdmin)); //before registring new admin check if the admin is already registered or not
router.get("/doctors", asyncAwaitErrors(getAllDoctors));
router.get("/patient/details", isUserAuthenticated, getUserDetails)
router.get("/admin/details", isAdminAuthenticated, getAdminDetails)
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isUserAuthenticated, logoutUser);
router.post("/doctor/add", isAdminAuthenticated, addDoctor);


export default router; 
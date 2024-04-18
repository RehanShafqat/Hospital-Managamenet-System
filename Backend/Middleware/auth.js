import customError from "./Error.js";
import jwt from "jsonwebtoken"
import user from "../Models/userSchema.js"
export const isAdminAuthenticated = async (req, res, next) => {
    //authentication
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new customError("Admin not authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await user.findById(decoded.id);

    //authorization
    if (req.user.role !== "Admin") {
        return next(new customError("User not allowed to access these resources", 400));
    }
    next();

}
//this is done to see if the user is authenticated or not before peroforming various tasks (view patient profile,update profile info)
export const isUserAuthenticated = async (req, res, next) => {
    //authentication
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new customError("Patient not authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await user.findById(decoded.id);

    //authorization
    if (req.user.role !== "Patient") {
        return next(new customError("User not allowed to access these resources", 400));
    }
    next();

}
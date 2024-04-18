import customError from "../Middleware/Error.js"
import User from "../Models/userSchema.js"
import { generateToken } from "../Utils/JWT.js"
import cloudinary from "cloudinary"

export const patientRegister = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !role) {
        console.log(req.body);
        return next(new customError("Please Enter Full details", 400));
    }
    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new customError("User already registered", 400));
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            role,
        });
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User successfully registered"
        });
    } catch (error) {
        return next(new customError(error.message, 500));
    }
};
export const login = async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new customError("Please enter full details", 400));
    }
    try {

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new customError("User not registered", 400));
        }


        const isPassCorrect = await user.comparePassword(password); // comparing Passwords

        if (!isPassCorrect) {
            return next(new customError("Wrong Password"), 400);
        }
        if (role !== user.role) {                               //check for the role even if the password and email matches
            return next(new customError("User with this role not found", 400));
        }
        generateToken(user, res, "User logged in successfully");

    } catch (error) {
        return next(new customError(error.message, 400));
    }


}

export const addNewAdmin = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob) {
        return next(new customError("Please Enter Full details", 400));
    }
    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new customError("User already registered", 400));
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            role: "Admin",
        });
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User successfully registered"
        });
    } catch (error) {
        return next(new customError(error.message, 500));
    }
}
export const getAllDoctors = async (req, res, next) => {
    const docters = await User.find({ role: "Doctor" })
    res.status(200).json({
        success: true,
        docters,
    })
}
export const getUserDetails = (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
}
export const getAdminDetails = (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
}
export const logoutAdmin = (req, res, next) => {
    res.status(200).cookie("adminToken", null, { httpOnly: true, expires: new Date(Date.now()) }).json({
        success: true,
        message: "Admin logged out successfully"
    })
}
export const logoutUser = (req, res, next) => {
    res.status(200).cookie("patientToken", null, { httpOnly: true, expires: new Date(Date.now()) }).json({
        success: true,
        message: "User logged out successfully"
    });
}
export const addDoctor = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new customError("Doctor Avatar required", 400));
    }
    const { doctorAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(doctorAvatar.mimetype)) {
        console.log(doctorAvatar.mimetype);
        return next(new customError("Please provide file in required format", 400));
    }
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        doctorDepartment
    } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !doctorDepartment) {
        return next(new customError("Please provide full details", 400));
    }
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
        return next(new customError("Doctor already exists", 400));
    }
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(doctorAvatar.tempFilePath);
        console.log(cloudinaryResponse);
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            doctorDepartment,
            role: "Doctor",
            docAvatar: {
                id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            }
        })
        res.status(200).json({
            success: true,
            message: "Doctor Registered",
            user,
        })

    } catch (error) {
        return next(new customError(error.message, 400));

    }
}
import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {

        type: String,
        required: true,
        validate: [validator.isEmail, "Valid Email Requried"],
    },
    phone: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 11,
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Transgender"],
    },
    password: {
        type: String,
        required: true,
        minLength: 10,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"]
    },
    doctorDepartment: {
        type: String
    },
    docAvatar: {
        id: String,
        url: String
    },
})
//whenever the userSchema is saved(while registring or while changing password) the password will be hashed immediately
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})
//comparing password while signing in 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//generating jwt
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES });
}
export const user = mongoose.model("users", userSchema);
export default user;
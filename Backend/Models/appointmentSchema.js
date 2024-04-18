import mongoose from "mongoose"
import validator from "validator";


const appointmentSchema = new mongoose.Schema({
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
    appointmentDate: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doctor: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,

        }
    },
    hasVisited: {
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["Accepted", "Rejected", "Pending"],
        default: "Pending",
    }
})
export const appointment = mongoose.model("appointments", appointmentSchema);
export default appointment;

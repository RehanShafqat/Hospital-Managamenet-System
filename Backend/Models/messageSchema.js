import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
    Phone: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 11,
    },
    message: {
        type: String,
        required: false,
        minLength: 10
    }

})
export const Message = mongoose.model("messages", messageSchema);
export default Message
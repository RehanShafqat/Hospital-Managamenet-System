import Message from "../Models/messageSchema.js"
import customError from "../Middleware/Error.js"

export const sendMessage = async (req, res, next) => {

    const { firstName, lastName, email, Phone, message } = req.body;

    if (!firstName || !lastName || !email || !Phone || !message) {
        return next(new customError("Please fill full form", 400));
    }

    try {

        await Message.create({ firstName, lastName, email, Phone, message });
        res.status(200).json({
            success: true,
            message: "Message saved successfully"
        });
    }
    catch (error) {
        return next(new customError(error.message, 400));
    }

}
export const getAllMessages =async (req, res, next) => {
    const messages = await Message.find();
    console.log("hello");
    res.status(200).json({
        success: true,
        messages,
    })
}
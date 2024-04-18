import cookieParser from "cookie-parser";
import app from "./app.js"
import cors from "cors"
import express from 'express';
import fileUpload from "express-fileupload";
import connection from "./Database/connection.js";
import cloudinary from "cloudinary"
import messageRouter from "./Router/messageRouter.js";
import { errorMiddleware } from "./Middleware/Error.js"
import userRouter from "./Router/userRouter.js"
import appointmentRouter from "./Router/appointmentRouter.js";


app.listen(process.env.PORT, () => {                   // listen on port
    console.log(`listening on ${process.env.PORT}`)
});



cloudinary.v2.config({                                //setting up cloudinary
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use(cors({                                        //enabling cors
    origin: [process.env.CLIENT_URL, process.env.BACKEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({ extended: true })) //app.use(express.urlencoded({ extended: true })) is setting up middleware in your Express.js application to automatically parse incoming request bodies that are URL-encoded, making the form data available in req.body for further processing in your routes. This is commonly used for handling form submissions from HTML forms without using javascript

app.use(fileUpload({                            //stores the file temporarily in the  /tmp/ directory
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))


connection();

//actual routers
app.use("/api/version1/message", messageRouter);
app.use("/api/version1/user",userRouter);
// app.use("/api/version1/appointment",appointmentRouter);







app.use(errorMiddleware) // prompting app to use specified middleware Function

export default app;
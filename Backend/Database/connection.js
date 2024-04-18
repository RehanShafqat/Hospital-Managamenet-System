import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "Hospital_Management_System",
        });
        console.log("Connection to database successful");
    } catch (err) {
        console.error(`Connection failed: ${err}`);
        throw err;
    }
};
export default connection;

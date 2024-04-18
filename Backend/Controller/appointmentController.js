import appointment from "../Models/appointmentSchema.js";
import customError from "../Middleware/Error.js"
import user from "../Models/userSchema.js";

export const postAppointment = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, dob, gender, appointmentDate, department, doctor_firstName, doctor_lastName, hasVisited } = req.body;

        console.log(doctor_firstName); // Log the request body for debugging
        console.log(doctor_lastName); // Log the request body for debugging

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !dob || !gender || !appointmentDate || !department || !doctor_firstName || !doctor_lastName) {
            return next(new customError("Please fill all the details", 400));
        }

        // Find the doctor based on firstName, lastName, department, and role
        const doctors = await user.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            doctorDepartment: department,
            role: "Doctor"
        });

        if (doctors.length === 0) {
            return next(new customError("No Doctor found", 404));
        } else if (doctors.length > 1) {
            return next(new customError("More than one doctor with the same credentials. Please contact through Email or Phone", 400));
        }

        const doctorId = doctors[0]._id;
        const patientId = req.user._id;

        // Create new appointment
        const newAppointment = await appointment.create({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            appointmentDate,
            department,
            doctor: {
                firstName: doctor_firstName,
                lastName: doctor_lastName
            },
            hasVisited,
            doctorId,
            patientId
        });

        res.status(200).json({
            success: true,
            message: "Appointment sent successfully",
            appointment: newAppointment
        });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return next(new customError("Failed to create appointment", 500));
    }
};
export const showAllAppointments = async (req, res, next) => {
    const appointments = await appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    })
}
export const updateAppointmentStatus = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        let updateAppointment = await appointment.findById(id);
        if (!updateAppointment) {
            return next(new customError("Appointment not found", 404))
        }
        updateAppointment = await appointment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: true,

        });
        res.status(200).json({
            success: true,
            message: "Status updated",
            updateAppointment,
        })
    } catch (error) {
        return next(new customError(error.message, 400));
    }
}
export const deleteAppointment = async (req, res, next) => {
    const {id} = req.params;
    try {

        let appointmentToBeDeleted = await appointment.findById(id);
        console.log(appointmentToBeDeleted);
        if (!appointmentToBeDeleted) {
            return next(new customError("Appointment not found", 404));
        }
        await appointmentToBeDeleted.deleteOne();
        res.status(200).json({
            success: true,
            message: "Appointment deleted"
        });



    } catch (error) {
        return next(new customError(error.message, 400))
    }


}
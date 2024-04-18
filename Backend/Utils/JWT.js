
export const generateToken = (user, res, message) => {
    const token = user.generateJsonWebToken();
    const cookieName = user.role == 'Admin' ? "adminToken" : "patientToken";

    res.status(200).cookie(cookieName, token, { httpOnly:true,expiresIn: new Date(Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000) }).json({
        success: true,
        message,
        user,
        token
    })
} 
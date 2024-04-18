class customError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const errorMiddleware = (err, req, res, next) => {      //error occcured in any of the route - > the error is passed to this func using next(err)
    err.message = err.message || "Internal Server Error"
    err.stausCode = err.statusCode || 500
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = customError(message, 400);
    }
    if (err.name == "JWTerror") {
        const message = "Json webtoken error ";
        err = customError(message, 400);
    }
    if (err.name == "tokenExpiredError") {
        const message = "Json webtoken expired";
        err = customError(message, 400);
    }
    if (err.name == "castError") {
        const message = `invalid ${err.path}`;
        err = customError(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
export default customError;
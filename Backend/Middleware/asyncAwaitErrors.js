const asyncAwaitErrors = (reqFunction) => {     // high order function => takes another function as parameter 
    return (req, res, next) => {                // another middleware function
        Promise.resolve(reqFunction(req, res, next)).catch(next)
    }
}

export default asyncAwaitErrors;
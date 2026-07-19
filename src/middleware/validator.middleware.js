const {validationResult } = require('express-validator');
const ApiError = require("../utils/api-error.js")

 const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next();
    }

    const extractedErrors = [];
    errors.array().map((err) => 

        extractedErrors.push({
            [err.path]: err.msg,
        })
    
    );

    throw new ApiError(422,"Recived data is no valid",extractedErrors)
};

module.exports = validate;
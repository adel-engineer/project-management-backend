class apiResponse{
    constructor(statusCode , data, message = "success"){
        this.statusCode  = statusCode,
        this.data = data,
        this.message = message,
        this.success = message > 400;
    }
}

module.exports = apiResponse;


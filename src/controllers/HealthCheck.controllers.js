const apiResponse = require("../utils/api-response.js")
const asyncHandler = require("../utils/asyncHandler.js")

const HealthCheck = asyncHandler(async (_, res) => {
    res.status(200).json(
        new apiResponse(200,"done")
    )
})

module.exports = HealthCheck;
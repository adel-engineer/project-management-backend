const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const ApiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ProjectMember = require("../models/projectmember.model.js");
const { default: mongoose } = require("mongoose");


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        ).select(
            "-password -refereshToken -emailEmailVerifiedToken -emailEmailVerifiedExpiry"
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        req.user = user;

        next();

    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

const validateProjectPermission = (roles = []) =>{
    asyncHandler(async (req, res, next)=>{
        const {projectId} = req.params;

        if(!projectId){
            throw new ApiError(400, "Project id is missing")
        }

       const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id)
        })

        if(!project){
            throw new ApiError(400, "Project not found")
        }

        const givenRole = project?.role

        req.user.role = givenRole
        
        if(!roles.includes(givenRole)){
            throw new ApiError(
                403,
                "You do not have permission to perform this action"
            )
        }

        next()
    });
}
module.exports = {
    verifyJWT,
    validateProjectPermission
}
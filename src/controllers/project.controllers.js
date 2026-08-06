const apiResponse = require("../utils/api-response.js")
const apiError = require("../utils/api-error.js")
const asyncHandler = require("../utils/asyncHandler.js")
const {Project} = require("../models/project.model.js")
const ProjectMember = require("../models/projectMember.model.js")
const mongoose = require("mongoose");
const {UserRoleEnum, AvailableUserRole} = require("../utils/constants.js")
const User = require("../models/user.model.js")

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRoleEnum.PROJECT_ADMIN
    });

    return res
        .status(201)
        .json(
            new apiResponse(
               201,
               project,
               "Project created successfully"
            )
        )
});

const getProjectById = asyncHandler(async (req, res) => {
    const {ProjectId} = req.params
    const project = await Project.findById(ProjectId)

    if(!project){
         throw new apiError(404,"project not found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                project,
                "projects fetched successfully"
            )
        )
});

const getProject = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
    {
        $match: {
        user: new mongoose.Types.ObjectId(req.user._id)
        }
    },
    {
        $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
            {
            $lookup: {
                from: "projectmembers",
                localField: "_id",
                foreignField: "project",
                as: "projectmembers"
            }
            },
            {
            $addFields: {
                members: {
                $size: "$projectmembers"
                }
            }
            }
        ]
        }
    },
    {
        $unwind: "$project"
    },
    {
        $project: {
        project: {
            _id: "$project._id",
            name: "$project.name",
            description: "$project.description",
            members: "$project.members",
            createdAt: "$project.createdAt",
            createdBy: "$project.createdBy"
        },
        role: 1,
        _id: 0
        }
    }
    ]);

    return res.status(200).json(new apiResponse(200, projects, "projects fetched successfully"))
});

const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {ProjectId} = req.params

   const project = await Project.findByIdAndUpdate(
        ProjectId,
        {
          name,
          description  
        },
        {new: true}
    )

    if(!project){
        throw new apiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                project,
               "Project updated successfully"
            )
        )
});

const deleteProject = asyncHandler(async (req, res) => {
    const{ProjectId} = req.params

    const project = await Project.findByIdAndDelete(ProjectId)
    if(!project){
        throw new apiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                project,
               "Project deleted successfully"
            )
        )
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const {email, role} = req.body
    const {ProjectId} = req.params

    const user = await User.findOne({email})
    const project = await Project.findById(ProjectId)

    if(!project){
        throw new apiError(404,"project not found")
    }

    if(!user){
        throw new apiError(404,"user not found")
    }

    if(!AvailableUserRole.includes(role)){
        throw new apiError(400, "Invalid role");
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(ProjectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(ProjectId),
            role: role
        },
        {
            new: true,
            upsert: true
        }
    )

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                {},
                "Member added successfully"
            )
        )
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {ProjectId} = req.params
    const project = await Project.findById(ProjectId)

    if(!project){
        throw new apiError(404, "the project not found")
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match:{
               project: new mongoose.Types.ObjectId(ProjectId)
            }
        },
        {
            $lookup:{
                from: "User",
                localField:"user",
                foreignField: "_id",
                as: "user",
                pipeline: [{
                    $project:{
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        avatar: 1
                    }
                }]
            }
        },
        {
            $addFields:{
                user:{
                    $arrayElemAt: ["$user", 0]
                }
            }
        },
        {
            $project: {
              project: 1,
              user: 1,
              role: 1,
              createdAt: 1,
              updatedAt: 1,
              _id: 0
            }
        }
    ])

    return res.status(200).json(new apiResponse(200, projectMembers, "Project members fetched successfully"))
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const {ProjectId, userId} = req.params
    const{newRole} = req.body

    if(!AvailableUserRole.includes(newRole)){
        throw new apiError(400, "Invaild Role")
    }
    let projectmember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(ProjectId),
        user: new mongoose.Types.ObjectId(userId)
    })
    if(!projectmember){
        throw new apiError(400, "Project Member not Found")
    }
    const projectMember = await ProjectMember.findByIdAndUpdate(
        projectmember._id,
        {
            role: newRole
        },
        {new: true}
    )

    if(!projectMember){
        throw new apiError(400,"project not found")
    }

    return res.status(200).json(new apiResponse(200, projectMember, "project member role Updated successfully"))

    
});

const deleteMember = asyncHandler(async (req, res) => {
    const {ProjectId, userId} = req.params

    let projectmember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(ProjectId),
        user: new mongoose.Types.ObjectId(userId)
    })
    if(!projectmember){
        throw new apiError(404, "Project Member not Found")
    }

    
    const projectMember = await ProjectMember.findByIdAndDelete(
        projectmember._id)
    

    if(!projectMember){
        throw new apiError(400,"project error not found")
    }

    return res.status(200).json(new apiResponse(200, projectMember, "project member Deleted successfully"))

});

module.exports = {
    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}
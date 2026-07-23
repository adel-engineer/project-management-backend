const apiResponse = require("../utils/api-response.js")
const apiError = require("../utils/api-error.js")
const asyncHandler = require("../utils/asyncHandler.js")
const ApiError = require("../utils/api-error.js")
const User = require("../models/user.model.js")

const {Project} = require("../models/project.model.js")
const{ProjectMember} = require("../models/projectMember.model.js")
const mongoose = require("mongoose");
const {UserRoleEnum, AvailableUserRole} = require("../utils/constants.js")
const { pipeline } = require("nodemailer/lib/xoauth2/index.js")

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.types.ObjectId(req.user._id)
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
               "Project Created Successfully"
            )
        )
});

const getProjectById = asyncHandler(async (req, res) => {
    //test
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

   const ptoject = await Project.findByAndUpdate(
        ProjectId,
        {
          name,
          description  
        },
        {new: true}
    )

    if(!Project){
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                project,
               "Project Updated Successfully"
            )
        )
});

const deleteProject = asyncHandler(async (req, res) => {
    const{ProjectId} = req.params

    const project = await Project.findByIdAndDelete(ProjectId)
    if(!Project){
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                project,
               "Project Deleted Successfully"
            )
        )
});

const addMemberToProject = asyncHandler(async (req, res) => {
    //test
});

const getProjectMembers = asyncHandler(async (req, res) => {
    //test
});

const updateMemberRole = asyncHandler(async (req, res) => {
    //test
});

const deleteMember = asyncHandler(async (req, res) => {
    //test
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
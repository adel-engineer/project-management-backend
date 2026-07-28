const User = require("../models/user.model.js");
const {Project} = require("../models/project.model.js");
const {Task} = require("../models/task.model.js");
const {SubTask} = require("../models/subtask.model.js");
const apiResponse = require("../utils/api-response.js");
const apiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/asyncHandler.js");
const mongoose = require("mongoose");
const {UserRoleEnum, AvailableUserRole} = require("../utils/constants.js");




const getTasks = asyncHandler(async(req, res) => {
    //test
});

const creatTask = asyncHandler(async(req, res) => {
    const {title, description, assignedTo, status} = req.body;
    const {projectId} = req.params;

   const project = await Project.findById(projectId);

   if(!project){
    throw new apiError(404, "project not found")
   }

   const files = req.files || []
   const attachements = files.map((file) => {
    return {
        url: `${process.env.SERVER_URL}/images/${file.originalname}`,
        MimeType: file.mimetype,
        size: file.size
    }
   });

   const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo ?  new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachements
   });

   return res
    .status(201)
    .json(
        new apiResponse(201, task, "Task created")
    )
});

const getTaskById = asyncHandler(async(req, res) => {
    //test
});

const updateTask = asyncHandler(async(req, res) => {
    //test
});

const deleteTask = asyncHandler(async(req, res) => {
    //test
});

const createSubTask = asyncHandler(async(req, res) => {
    //test
});

const updateSubTask = asyncHandler(async(req, res) => {
    //test
});

const deleteSubTask = asyncHandler(async(req, res) => {
    //test
});

module.exports = {
    getTasks,
    creatTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
}
const User = require("../models/user.model.js");
const {Project} = require("../models/project.model.js");
const {Task} = require("../models/task.model.js");
const {SubTask} = require("../models/subtask.model.js");
const apiResponse = require("../utils/api-response.js");
const apiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/asyncHandler.js");
const mongoose = require("mongoose");
const {UserRoleEnum, AvailableUserRole} = require("../utils/constants.js");
const { pipeline } = require("nodemailer/lib/xoauth2/index.js");
const ApiError = require("../utils/api-error.js");



const getTasks = asyncHandler(async(req, res) => {
   const {projectId} = req.params;
   const project = await Project.findById(projectId);

   if(!project){
     throw new apiError(404, "project not found")
   }

   const tasks = await Task.find({
     project: new mongoose.Types.ObjectId(projectId),
   }).populate("assignedTo", "avatar username fullName")

    return res
     .status(201)
     .json(
         new apiResponse(201, tasks, "Task fetched successfully")
     )

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
        new apiResponse(201, task, "Task created successfully")
    )
});

const getTaskById = asyncHandler(async(req, res) => {
    const {taskId} = req.params;

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from:"users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                   {
                     _id: 1,
                     username: 1,
                     fullname:1,
                     avater: 1
                   }
                ]
            }
        },
        {
            $lookup: {
                from:"subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                      $lookup: {
                         from:"users",
                         localField: "ceatedBy",
                         foreignField: "_id",
                         as: "ceatedBy",
                         pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    fullName: 1,
                                    avater: 1
                                }
                            }
                         ]

                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createBy", 0]
                            }
                        }
                    }
                ],
            },
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["assignedTo", 0]
                }
            }
        }
    ]);

    if(!task || task.length === 0){
        throw new ApiError(404, "task not found")
    }

    return res.status(200).json(new apiResponse(200, task[0], "task fetched successfully"))

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
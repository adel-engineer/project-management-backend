const {Project} = require("../models/project.model.js");
const {Task} = require("../models/task.model.js");
const {SubTask} = require("../models/subtask.model.js");
const apiResponse = require("../utils/api-response.js");
const apiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/asyncHandler.js");
const mongoose = require("mongoose");
const {AvailableTaskStatues} = require("../utils/constants.js");
const ProjectMember = require("../models/projectmember.model.js");



const getTasks = asyncHandler(async(req, res) => {
   const {projectId} = req.params;
   const project = await Project.findById(projectId);

   if(!project){
     throw new apiError(404, "Project not found")
   }

   const tasks = await Task.find({
     project: new mongoose.Types.ObjectId(projectId),
   }).populate("assignedTo", "avatar username fullName")

    return res
     .status(200)
     .json(
         new apiResponse(200, tasks, "Task fetched successfully")
     )

});

const creatTask = asyncHandler(async(req, res) => {
   const {title, description, assignedTo, status} = req.body;
   const {projectId} = req.params;

   const project = await Project.findById(projectId);

    if(!project){
    throw new apiError(404, "Project not found")
   }

   if(assignedTo){
    const member = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(assignedTo),
        project: new mongoose.Types.ObjectId(projectId),        
    });
    if (!member) {
        throw new apiError(404, "Member is not part of this project");
    };
   };

 

   const files = req.files || []
   const attachements = files.map((file) => {
    return {
        url: `${process.env.SERVER_URL}/images/${Date.now() + file.originalname}`,
        mimeType: file.mimetype,
        size: file.size
    }
   });

   if(!AvailableTaskStatues.includes(status)){
    throw new apiError(400, "Invalid status")
   }

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
                        $project:{
                             _id: 1,
                              username: 1,
                              fullName:1,
                              avatar: 1
                        }
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
                         localField: "createdBy",
                         foreignField: "_id",
                         as: "createdBy",
                         pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    fullName: 1,
                                    avatar: 1
                                }
                            }
                         ]

                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ],
            },
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0]
                }
            }
        }
    ]);

    if(!task || task.length === 0){
        throw new apiError(404, "Task not found")
    }

    return res.status(200).json(new apiResponse(200, task[0], "task fetched successfully"))

});

const updateTask = asyncHandler(async(req, res) => {
    const {taskId} = req.params
    const {title, description, assignedTo, status} = req.body;
    const updateTask = {}


    let task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
    })
 
    if(!task){
        throw new apiError(404,"Task does not exist")
    }


    let projectMember

    if (assignedTo) {
        projectMember = await ProjectMember.findOne({
            user: new mongoose.Types.ObjectId(assignedTo),
            project: new mongoose.Types.ObjectId(task.project),
        })

        if(!projectMember){
            throw new apiError(404, "Member is not part of this project");
        }

        updateTask.assignedTo = assignedTo;

    }

    if(status){
        if(!AvailableTaskStatues.includes(status)){
            throw new apiError(400, "Status is wrong")
        }
    }

    if(title){
        updateTask.title = title
    }
    if(description){
        updateTask.description = description
    }
    if(assignedTo){
        updateTask.assignedTo = assignedTo
    }
    if(status){
        updateTask.status = status
    }

    const updatedTask = await Task.findByIdAndUpdate(
        task._id,
        updateTask,
        {
            new: true
        }
    )

    if(!updatedTask){
        throw new apiError(400,"Task was not updated")
    }

    return res.status(200).json(new apiResponse(200,updatedTask, "Task updated successfully"))
    
});

const deleteTask = asyncHandler(async(req, res) => {
    const {projectId, taskId} = req.params

    let task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId)
    })

    if(!task){
      throw new apiError(404, "Task not Found")
    }
    
    const deleteTask = await Task.findByIdAndDelete(task._id)

    if(!deleteTask){
        throw new apiError(400,"Task not deleted")
    }

    return res.status(200).json(new apiResponse(200, deleteTask, "Task deleted successfully"))
});

const createSubTask = asyncHandler(async(req, res) => {
    const {projectId, taskId} = req.params
    const {title} = req.body

    let task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId)
    });

    if(!task){
        throw new apiError(404, "Task not found")
    };

    const subtask = await SubTask.create({
        title,
        task: new mongoose.Types.ObjectId(task._id),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    return res
     .status(201)
     .json(
        new apiResponse(201, subtask, "Subtask created successfully")
    )
});

const updateSubTask = asyncHandler(async(req, res) => {
    const { projectId, subTaskId } = req.params;
    const {title, isCompleted} = req.body

    const subtask = await SubTask.findById(subTaskId)
    if(!subtask){
        throw new apiError(404, "Subtask not found")
    }

    const task = await Task.findById(subtask.task)
    if(!task){
        throw new apiError(404, "task not found")
    }

    if(task.project.toString() !== projectId){
        throw new apiError(404, "SubTask does not belong to this project")
    }

    const updateSubTaskData  = {}

    if(title){
        updateSubTaskData .title = title
    }

    if(isCompleted !== undefined){
        updateSubTaskData .isCompleted = isCompleted
    }

    const update = await SubTask.findByIdAndUpdate(
        subTaskId,
        updateSubTaskData,
        {
            new: true
        }
    )

    return res.status(200).json(new apiResponse(200,update, "Subtask updated successfully"))

});

const deleteSubTask = asyncHandler(async(req, res) => {
    const { projectId, subTaskId } = req.params;

    const subtask = await SubTask.findById(subTaskId)
    if(!subtask){
        throw new apiError(404, "Subtask not found")
    }

    const task = await Task.findById(subtask.task)
    if(!task){
        throw new apiError(404, "task not found")
    }

    if(task.project.toString() !== projectId){
        throw new apiError(404, "SubTask does not belong to this project")
    }

    const deletedSubTask = await SubTask.findByIdAndDelete(subTaskId)
    if(!deletedSubTask){
        throw new apiError(400, "Subtask was not deleted")
    }

    return res.status(200).json(new apiResponse(200, deletedSubTask, "Subtask deleted successfully"))

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
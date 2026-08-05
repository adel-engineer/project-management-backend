const User = require("../models/user.model.js");
const {Project} = require("../models/project.model.js");
const {Task} = require("../models/task.model.js");
const {SubTask} = require("../models/subtask.model.js");
const {ProjectNote} = require("../models/notes.model.js")
const apiResponse = require("../utils/api-response.js");
const apiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/asyncHandler.js");
const mongoose = require("mongoose");
const {UserRoleEnum, AvailableUserRole} = require("../utils/constants.js");
const { pipeline } = require("nodemailer/lib/xoauth2/index.js");
const ProjectMember = require("../models/projectmember.model.js");


const getNotes = asyncHandler(async(req, res) => {
    const {projectId} = req.params;
    const project = await Project.findById(projectId)

    if(!project){
        throw new apiError(404, "project not found")
    }

    const notes = await ProjectNote.find({
         project: new mongoose.Types.ObjectId(projectId),
    }).populate("createdBy", "username fullName avatar");

    return res
     .status(201)
     .json(
         new apiResponse(200, notes, "Note fetched successfully")
     )

});

const createNotes = asyncHandler(async(req, res) => {
    const {content} = req.body;
    const {projectId} = req.params;
    
    const project = await Project.findById(projectId);
    
    if(!project){
        throw new apiError(404, "project not found")
    }
    
   const notes = await ProjectNote.create({
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    content,
   });

   return res
    .status(201)
    .json(
        new apiResponse(201, notes, "Note created successfully")
    )
});

const getNotesById = asyncHandler(async(req, res) => {
    const {projectId, noteId} = req.params;

    const notes = await ProjectNote.findOne({
        _id: new mongoose.Types.ObjectId(noteId),
        project: projectId
    }).populate("createdBy", "username fullName avatar");

    if(!notes){
        throw new apiError(404, "note not found")
    }

    return res
      .status(200)
      .json(
         new apiResponse(200, notes, "notes featched successfully")
    )
});

const updateNotes = asyncHandler(async(req, res) => {
    const {projectId, noteId} = req.params;
    const {content} = req.body;

    const notes = await ProjectNote.findOne({
        _id: new mongoose.Types.ObjectId(noteId),
        project: projectId
    });

    if(!notes){
        throw new apiError(404, "note not found")
    }

    const updateData  = {}

    if(content){
        updateData .content = content
    }

    const update = await ProjectNote.findByIdAndUpdate(
        noteId,
        updateData ,
        {
                new: true
        }
    )

    if(!update){
        throw new apiError(400,"note not update")
    }

    return res.status(200).json(new apiResponse(200,update, "note Updated successfully"))
});

const deleteNotes = asyncHandler(async(req, res) => {
    const{projectId, noteId} = req.params;

    const note = await ProjectNote.findOne({
        _id: new mongoose.Types.ObjectId(noteId),
        project: projectId
    });

    if(!note){
       throw new apiError(400,"note not found")
    }

    const deleteNote = await ProjectNote.findByIdAndDelete(noteId)

    if(!deleteNote){
        throw new apiError(400, "delete note does not deleted")
    }

    return res.status(200).json(new apiResponse(200, deleteNote, "Note Deleted successfully"))
});
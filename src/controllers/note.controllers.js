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
    //test
});

const createNotes = asyncHandler(async(req, res) => {
    //test
});

const getNotesById = asyncHandler(async(req, res) => {
    //test
});

const updateNotes = asyncHandler(async(req, res) => {
    //test
});

const deleteNotes = asyncHandler(async(req, res) => {
    //test
});
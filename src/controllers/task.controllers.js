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
    //test
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
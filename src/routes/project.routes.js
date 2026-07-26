const express = require("express")
const route = express.Router()
const {

    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember

} = require("../controllers/project.controllers.js");

const validate = require("../middleware/validator.middleware.js")
const {
    createProjectValidator,
    addMemberToProjectValidator
} = require("../validators/index.js");

const {
      verifyJWT,
      validateProjectPermission
    } = require("../middleware/auth.middleware.js")

module.exports = route
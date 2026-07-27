const express = require("express");
const router = express.Router();

const {
    verifyJWT,
    validateProjectPermission
} = require("../middleware/auth.middleware.js");

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

const validate = require("../middleware/validator.middleware.js");

const {
    createProjectValidator,
    addMemberToProjectValidator
} = require("../validators");
const { AvailableUserRole, UserRoleEnum } = require("../utils/constants.js");
//to auth
router.use(verifyJWT)


router
    .route("/")
    .get(getProject)
    .post(createProjectValidator(), validate, createProject);

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermission([UserRoleEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([UserRoleEnum.ADMIN]),
        deleteProject
    )


router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRoleEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMemberToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([UserRoleEnum.ADMIN]),
        updateMemberRole)
    .delete(validateProjectPermission([UserRoleEnum.ADMIN]), deleteMember);

module.exports = router;

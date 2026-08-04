const express = require("express");
const router = express.Router();

const {
    verifyJWT,
    validateProjectPermission
} = require("../middleware/auth.middleware.js");

const {
    getTasks,
    creatTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} = require("../controllers/task.controllers.js");

const validate = require("../middleware/validator.middleware.js");
const {creatTaskValidator, createSubTaskValidator, updateSubTaskValidator} = require("../validators")

const {
    UserRoleEnum,
    AvailableUserRole,
    TaskStatusEnum,
    AvailableTaskStatues
}
= require("../utils/constants.js")//to auth
router.use(verifyJWT)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getTasks)
    .post(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        creatTaskValidator(),
        validate,
        creatTask
    );

router
    .route("/:projectId/t/:taskId")
    .get(validateProjectPermission(AvailableUserRole), getTaskById)
    .put(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        creatTaskValidator(),
        validate,
        updateTask
    )
    .delete(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        deleteTask
    )

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        createSubTaskValidator(),
        validate,
        createSubTask
    )

router
    .route("/:projectId/st/:subTaskId")
    .put(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        updateSubTaskValidator(),
        validate,
        updateSubTask
    )
    .delete(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        deleteSubTask
    )

module.exports = router;

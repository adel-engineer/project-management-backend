const express = require("express");
const router = express.Router();

const {
    verifyJWT,
    validateProjectPermission
} = require("../middleware/auth.middleware.js");

const {
    getNotes,
    createNotes,
    getNotesById,
    updateNotes,
    deleteNotes
} = require("../controllers/note.controllers.js");

const validate = require("../middleware/validator.middleware.js");
const {createNotesValidator, updateNotesValidator} = require("../validators/index.js")

const {
    UserRoleEnum,
    AvailableUserRole
}
= require("../utils/constants.js")//to auth
router.use(verifyJWT)


router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getNotes)
    .post(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        createNotesValidator(),
        validate,
        createNotes
    );

router
    .route("/:projectId/n/:noteId")
    .get(validateProjectPermission(AvailableUserRole), getNotesById)
    .put(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        updateNotesValidator(),
        validate,
        updateNotes
    )
    .delete(
        validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
        deleteNotes
    )

module.exports = router;
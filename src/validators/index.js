const {body} = require("express-validator");
const {
    UserRoleEnum,
    AvailableUserRole,
    TaskStatusEnum,
    AvailableTaskStatues
}
= require("../utils/constants.js")
const userRegisterValidator  = () => {
    return[
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("user name is required")
        .isLength({min: 3})
        .withMessage("Username must be at least 3 characters long"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is reqiured"),
    body("fullName")
        .optional()
        .trim()
    ]
};

const userLoginValidator = () => {
    return [
        body("email")
         .notEmpty()
         .withMessage("Email is required")
         .isEmail()
         .withMessage("Email is invalid"),
         
        body("password")
          .notEmpty()
          .withMessage("password is required"),
    ];
};

const userChangeCurrentPasswordValidator = () => {
    return [
        body("currentPassword")
            .notEmpty()
            .withMessage("Old password is required"),

        body("newPassword")
            .notEmpty()
            .withMessage("New password is required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required"),
    ];
};

const createProjectValidator = () => {
    return[
        body("name")
            .notEmpty()
            .withMessage("Nmae is required"),
        body("description")
            .optional(),
    ];
}

const addMemberToProjectValidator = () => {
    return[
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("email is invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is Required")
            .isIn(AvailableUserRole)
            .withMessage("Role is invaild")
            
        
    ]
};

const creatTaskValidator = () => {
    return[
        body("title")
            .trim()
            .notEmpty()
            .withMessage("title is required")
            .isString()
            .withMessage("Title must be a string"),
        body("status")
            .notEmpty()
            .withMessage("status is required")
            .isIn(AvailableTaskStatues)
            .withMessage("Status is invalid"),
        body("description")
            .optional()
            .isString()
            .withMessage("description must be string"),
        body("assignedTo")
            .notEmpty()
            .withMessage("AssignedTo is required")
            .isMongoId()
            .withMessage("AssignedTo must be a valid MongoDB ObjectId")    ]
};

const createSubTaskValidator = () => {
    return[
     body("title")
        .notEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("Title must be a string")
    ]
};

const updateSubTaskValidator = () => {
    return[
    body("title")
        .optional()
        .isString()
        .withMessage("Title must be a string"),
  
    body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("isCompleted must be a boolean")

    ]
};

const createNotesValidator = () => {
    return [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Content is required")
            .isString()
            .withMessage("Content must be a string")
    ];
};

module.exports = {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator,
    creatTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator
};
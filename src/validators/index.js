const {body} = require("express-validator");
const {AvailableUserRole} = require("../utils/constants.js")
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

const createProjectValidtor = () => {
    return[
        body("name")
            .notEmpty()
            .withMessage("Nmae is required"),
        body("description")
            .optional(),
    ];
}

const addMembertoProjectValidtor = () => {
    return[
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail
            .withMessage("email is invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is Required")
            .isIn(AvailableUserRole
            .withMessage("Role is invaild")
            )
        
    ]
}


module.exports = {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidtor,
    addMembertoProjectValidtor

};
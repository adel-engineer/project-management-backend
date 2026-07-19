const express = require("express")
const route = express.Router()

const {
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    forgotPassword,
    resetForgotPassword,
    refershToken,
    changeCurrentPassword,
    resendEmailVerification
} = require("../controllers/auth.controllers");

const validate = require("../middleware/validator.middleware.js")
const {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
} = require("../validators/index.js");const verifyJWT = require("../middleware/auth.middleware.js")


//Unsecured Routes
route.post("/register",userRegisterValidator(), validate, registerUser);
route.post("/login", userLoginValidator(), validate, login);
route.get("/verify-email/:verificationToken", verifyEmail);
route.post("/refresh-token", refershToken);
route.post("/forgot-password", userForgotPasswordValidator(), validate, forgotPassword);
route.post("/reset-password/:resetToken", userResetForgotPasswordValidator(), validate, resetForgotPassword);


//secured Routes
route.post("/logout", verifyJWT, logoutUser);
route.get("/current-user", verifyJWT, getCurrentUser);
route.post("/change-password", verifyJWT,userChangeCurrentPasswordValidator() , validate, changeCurrentPassword);
route.post("/resend-email-verification", verifyJWT, resendEmailVerification)

module.exports = route
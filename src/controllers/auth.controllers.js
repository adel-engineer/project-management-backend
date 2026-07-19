const user = require("../models/user.model.js")
const apiResponse = require("../utils/api-response.js")
const apiError = require("../utils/api-error.js")
const asyncHandler = require("../utils/asyncHandler.js")
const ApiError = require("../utils/api-error.js")
const User = require("../models/user.model.js")
const {sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent} = require("../utils/mail.js")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");



const generateAccessAndRefreshTokens = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refereshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }catch{
        throw new ApiError(
            500,
            "something went wrong",
        )
    }
}

const registerUser = asyncHandler(async (req, res) =>{
    const {email, username, password, role} = req.body

    //find a user
   const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already exsit", [])
    }

   const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const {unHashedToken,hashedToken, tokenExpiry} = user.generateTemporaryToken();
    
    user.emailEmailVerifiedToken = hashedToken
    user.emailEmailVerifiedExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})


    await sendEmail({
        email:user?.email,
        subject: "please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
        ),
    });

    const createUser = await User.findById(user._id).select(
        "-password -refereshToken -emailEmailVerifiedToken -emailEmailVerifiedExpiry",
    );

    if(!createUser){
        throw new ApiError(500, "something went wrong while reqistering a user")
    }

    return res
      .status(200)
      .json(
        new apiResponse(
            200,
            {user: createUser},
            "user registered!"
        )
      );

});

const login = asyncHandler(async (req,res) =>{
    const {usekrname, password, email} = req.body

    if(!email){
        throw new ApiError(400, "email is required!")
    }

   const user = await User.findOne({email});

   if(!user){
    throw new ApiError(400, "user does not exists");
   }

   const ispasswordValid = await user.isPasswordCorrect(password);
   if(!ispasswordValid){
    throw new ApiError(400, "Invalid password")
   }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select(
        "-password -refereshToken -emailEmailVerifiedToken -emailEmailVerifiedExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
            200,
           { user: loggedInUser,
            accessToken,
            refreshToken
           },
           "User logged in successfully"
        )
      )
});

const logoutUser = asyncHandler(async (req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken:""}
        },
        {
            new: true
        },
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                {},
                "user logged out successfully"
            )
        )
});

const getCurrentUser = asyncHandler(async (req, res)=>{

    console.log(req.user);
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                req.user,
                "current user fetched successfully"
            )
        )
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params;
    
    if(!verificationToken){
        throw new ApiError(400, "verification token is required")
    }

    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");


    const user = await User.findOne({
        emailEmailVerifiedToken: hashedToken,
        emailEmailVerifiedExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(400, "invalid or expired verification token")
    }

    user.emailEmailVerifiedToken = undefined;
    user.emailEmailVerifiedExpiry = undefined
    
    user.isEmailVerified = true;

    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {isEmailVerified: user.isEmailVerified},
                "email verified successfully"
            )
        )
});

const resendEmailVerification = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(
            404,
            "usernot found",
            []
        )
    }
    if(user.isEmailVerified){
        throw new ApiError(
            400,
            "email is already verified",
            []
        )
    }

    const {unHashedToken,hashedToken, tokenExpiry} = user.generateTemporaryToken();
    
    user.emailEmailVerifiedToken = hashedToken
    user.emailEmailVerifiedExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})


    await sendEmail({
        email:user?.email,
        subject: "please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
        ),
    });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "email verification link sent successfully"
            )
        )


});

const refershToken = asyncHandler(async (req, res) =>{
    const incomingRefreshToken = 
         req.cookies?.refreshToken ||
         req.body.refereshToken;

         if(!incomingRefreshToken){
            throw new ApiError(
                401,
                "refresh token is required",
                []
            )
         }

        try {
            const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id)

        if(!user){
            throw new ApiError(
                404,
                "Invalid refresh token",
                []
            )
        }

        if(incomingRefreshToken !== user.refereshToken){
            throw new ApiError(
                401,
                "the token is expired",
                []
            )
        }
        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        user.refereshToken = newRefreshToken
        await user.save({validateBeforeSave: false})

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "access and refresh token generated successfully",
            )
        )
        }catch (error) {
            throw new ApiError(
                401,
                "invalid refresh token",
                []
            )
        }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(
            404,
            "user not found",
            []
        )
    }

   const {tokenExpiry, hashedToken, unHashedToken} =  user.generateTemporaryToken()

   user.forgotPasswordToken = hashedToken;
   user.forgotPasswordExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });
    await sendEmail({
        email:user?.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGET_PASSWORD_URL}/${unHashedToken}`,
        ),
    });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "password reset link sent to your email"
            )
        )

});

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const {newPassword} = req.body;

    let hashedToken = crypto
        .createHash("sha256")
        .update( resetToken )
        .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(
            400,
            "Invalid or expired reset token",
        )
    }


    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "password reset successfully"
            )
        )
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if(!isPasswordValid){
        throw new ApiError(
            401,
            "Password is not correct"
        )
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                [],
                "Password has changed successfuly"

            )
        )

});


module.exports = {
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refershToken,
    forgotPassword,
    resetForgotPassword,
    changeCurrentPassword

};
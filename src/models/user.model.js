const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { type } = require("os");



const userSchema = new Schema(
  {
    avatar: {
      url: {
        type: String,
        default: "https://via.placeholder.com/200x200"
      },
      localPath: {
        type: String,
        default: ""
      }
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },

    fullName: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    refereshToken: {
      type: String
    },

    forgotPasswordToken: {
      type: String
    },

    forgotPasswordExpiry: {
      type: Date
    },

    emailEmailVerifiedToken: {
      type: String
    },

    emailEmailVerifiedExpiry: {
      type: Date
    },


    
  },
  {
    timestamps: true
  }
);

/**hooks */
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
       return;
    }
    this.password = await bcrypt.hash(this.password, 10)

})

// Methods
userSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
    _id: this._id,
    email: this.email,
    username: this.username
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
};

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
  )
};

userSchema.methods.generateTemporaryToken = function (){
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + (20 * 60 * 1000);

    return {
        unHashedToken,
        hashedToken,
        tokenExpiry
    };
};

const User = mongoose.model("User", userSchema);




module.exports = User;

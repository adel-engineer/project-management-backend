const mongoose = require("mongoose");
const { Schema } = mongoose;
const {AvailableUserRole, UserRoleEnum} = require("../utils/constants");

const projectMemberSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    role: {
        type: String,
        enum: AvailableUserRole,
        default: UserRoleEnum.MEMBER

    }

},{timestamps: true})

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema)
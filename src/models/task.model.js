const mongoose = require("mongoose");
const { Schema } = mongoose;
const {AvailableTaskStatues, TaskStatusEnum} = require("../utils/constants");

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },

    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: AvailableTaskStatues,
        default: TaskStatusEnum.TODO
    },

    attachments: {
        type: [{
            type: String,
            mimetype: String,
            size: Number
        }],
        default: []  
    }
},{timestamps: true})


const Task = mongoose.model("Task", taskSchema)
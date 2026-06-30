const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    status: {
        type: String,
        enum: ["to do", "in progress", "under review", "done"],
        default: "to do",
        required: [true, "status is required"]
    },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low",
        required: [true, "priority is required"]
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "task must belong to a project"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Task", TaskSchema)
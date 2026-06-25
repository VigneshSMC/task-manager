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
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Project,
        required: [true, "task must belong to a project"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Task", TaskSchema)
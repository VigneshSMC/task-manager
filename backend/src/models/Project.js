const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "name is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
})


module.exports = mongoose.model("Project", ProjectSchema)
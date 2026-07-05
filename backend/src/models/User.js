const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'please provide a username']
    },
    email: {
        type: String,
        required: [true, 'please provide an email id'],
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user"
    }
},{
    timestamps: true
})

module.exports=mongoose.model('User', userSchema)
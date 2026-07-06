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
    }
},{
    timestamps: true
})

module.exports=mongoose.model('User', userSchema)
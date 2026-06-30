const User = require('../models/User')
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        if (!users) return res.status(404).json({error: "users not found"})
        res.status(200).json(users)
    }
    catch(error) {
        res.status(404).json({error: error.message})
    }
}
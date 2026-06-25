const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body
        const exists = await User.findOne({ email })
        if (exists) res.json({ message: "user already exists" })
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email, name, password: hashedPassword
        })
        res.json({ message: "registered successfully", user: {name: newUser.name, email: newUser.email} })
    }
    catch (error) {
        res.status(500).json({error})
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const exists = await User.findOne({email})
        if (!exists) return res.status(400).json({message: "user does not exist"})
        const unhashed = await bcrypt.compare(password, exists.password)
        if (unhashed) return res.status(200).json({message: "login successful", user: { name: exists.name, email: exists.email }})
    }
    catch(error) {
        res.status(500).json({error})
    }
    res.json({ message: "login successful" })
}
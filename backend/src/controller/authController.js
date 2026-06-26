const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try {
        const { email, name, password, role } = req.body
        const exists = await User.findOne({ email })
        if (exists) res.status(409).json({ error: "user already exists" })
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email, name, password: hashedPassword, role
        })
        const token = generateToken(newUser._id, newUser.role)
        res.json({ message: "registered successfully", user: 
            {name: newUser.name, email: newUser.email, token, role: newUser.role} })
    }
    catch (error) {
        res.status(404).json({error: error.message})
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const exists = await User.findOne({email})
        if (!exists) return res.status(404).json({error: "user does not exist"})
        const unhashed = await bcrypt.compare(password, exists.password)
        const token = generateToken(exists._id, exists.role)
        if (unhashed) return res.status(200).json({message: "login successful", user: 
            { name: exists.name, email: exists.email, token }})
        throw { message : "enter valid credentials"};
    }
    catch(error) {
        res.status(401).json({error : error.message})
    }
}

const generateToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: "1h"})
}
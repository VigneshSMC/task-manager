const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const registerValidation = [
    body('name').trim().notEmpty().withMessage('name should be present'),
    body('email').trim().notEmpty().withMessage('email should be present'),
    body('password').trim().notEmpty().withMessage('password should be present'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
        next()
    }
]

const loginValidation = [
    body('email').trim().notEmpty().withMessage('Please enter a valid email id'),
    body('password').trim().notEmpty().withMessage('password should be present'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
        next()
    }
]

const jwtVerifier = (req, res, next) => {

    let token = req.headers.authorization
    if (token && token.startsWith("Bearer")) {
        try {
            token = token.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded.id
            next()
        } catch(error) {
            res.status(401).json({error: error.message})
        }        
    }
    else {
        return res.status(401).json({error: "token not provided"})
    }
}

module.exports = {registerValidation, loginValidation, protect: jwtVerifier};
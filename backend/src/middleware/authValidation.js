const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const verifier = require('../config/CognitoVerifier')

const registerValidation = [
    body('name').trim().notEmpty().withMessage('name should be present'),
    body('email').trim().notEmpty().withMessage('email should be present'),
    body('password').trim().notEmpty().withMessage('password should be present'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        next()
    }
]

const loginValidation = [
    body('email').trim().notEmpty().withMessage('Please enter a valid email id'),
    body('password').trim().notEmpty().withMessage('password should be present'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        next()
    }
]

const jwtVerifier = (req, res, next) => {

    let token = req.headers.authorization
    if (token && token.startsWith("Bearer")) {
        try {
            token = token.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).json({ error: error.message })
        }
    }
    else {
        return res.status(401).json({ error: "token not provided" })
    }
}

const cognitoAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        console.log(authHeader)
        if (!authHeader) return res.status(401).json({ message: "missing token" })
        const token = authHeader.replace("Bearer ", "");

        const payload = await verifier.verify(token);

        const { "cognito:groups": groups} = payload

        req.user = payload;
        req.user.roles = groups

        next();

    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

    module.exports = { registerValidation, loginValidation, protect: jwtVerifier, cognitoAuth };
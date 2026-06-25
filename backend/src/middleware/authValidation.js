const { body, validationResult } = require('express-validator')

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

module.exports = {registerValidation, loginValidation};
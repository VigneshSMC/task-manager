const { body, validationResult } = require('express-validator')

const postValidation = [
    body('name').trim().notEmpty().withMessage("Project name should not be empty"),
    body('description').trim().notEmpty().withMessage("description should not be empty"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty) return res.status(400).json({errors: errors.array()})
        next()
    }
]

module.exports = { postValidation }
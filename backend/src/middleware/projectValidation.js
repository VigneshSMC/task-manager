const { body, validationResult } = require('express-validator')

const postValidation = [
    body('name').trim().notEmpty().withMessage("Project name should not be empty"),
    body('description').trim().notEmpty().withMessage("description should not be empty"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty) return res.status(400).json({ errors: errors.array() })
        next()
    }
]

const projectAuthorization = (req, res, next) => {
    const { roles } = req.user
    console.log("roles", roles)
    if (roles.some(u => !['manager', 'admin'].includes(u))) return res.status(401).json({ message: 'user is not authorized to access this functionality' })
    next()
}

module.exports = { postValidation, projectAuthorization }
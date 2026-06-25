const express = require('express')
const router = express.Router()

const { registerUser, userLogin } = require('../controller/authController')
const { registerValidation, loginValidation } = require('../middleware/authValidation')

router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, userLogin)

module.exports=router
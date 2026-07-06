const express = require('express')
const router = express.Router()

const { registerUser, userLogin, cognitoUserHandler } = require('../controller/authController')
const { registerValidation, loginValidation } = require('../middleware/authValidation')
const { cognitoAuth } = require('../middleware/authValidation')

router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, userLogin)
router.post("/verify", cognitoAuth, cognitoUserHandler)

module.exports=router
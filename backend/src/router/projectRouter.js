const express = require('express')
const router = express.Router()
const { getProjects, getProject, updateProject, addProject, deleteProject, inviteAndAssign } = require('../controller/projectController')
const { projectValidation } = require('../middleware/idValidation')
const { postValidation } = require('../middleware/projectValidation')
const taskRouter = require('../router/taskRouter')
const { protect, cognitoAuth } = require('../middleware/authValidation')
const userGenerator = require('../middleware/userGenerator')

router.use("/:id/tasks", cognitoAuth, taskRouter)

router.get("/", cognitoAuth, userGenerator, getProjects)
router.get("/:id", cognitoAuth, projectValidation, getProject)
router.put("/:id", cognitoAuth, projectValidation, updateProject)
router.delete("/:id", cognitoAuth, projectValidation, deleteProject)
router.post("/", cognitoAuth, postValidation, addProject)

router.post("/:id/memebers", inviteAndAssign)

module.exports=router
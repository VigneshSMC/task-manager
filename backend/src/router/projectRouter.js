const express = require('express')
const router = express.Router()
const { getProjects, getProject, updateProject, addProject, deleteProject, inviteAndAssign } = require('../controller/projectController')
const { projectValidation } = require('../middleware/idValidation')
const { postValidation, projectAuthorization } = require('../middleware/projectValidation')
const taskRouter = require('../router/taskRouter')
const { protect, cognitoAuth } = require('../middleware/authValidation')

router.use("/:id/tasks", cognitoAuth, taskRouter)

router.get("/", cognitoAuth, getProjects)
router.get("/:id", cognitoAuth, projectValidation, getProject)
router.put("/:id", cognitoAuth, projectAuthorization, projectValidation, updateProject)
router.delete("/:id", cognitoAuth, projectAuthorization, projectValidation, deleteProject)
router.post("/", cognitoAuth, projectAuthorization, postValidation, addProject)

router.post("/:id/memebers", inviteAndAssign)

module.exports=router
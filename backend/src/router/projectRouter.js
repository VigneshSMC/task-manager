const express = require('express')
const router = express.Router()
const { getProjects, getProject, updateProject, addProject, deleteProject, inviteAndAssign } = require('../controller/projectController')
const { projectValidation } = require('../middleware/idValidation')
const { postValidation } = require('../middleware/projectValidation')
const taskRouter = require('../router/taskRouter')
const { protect } = require('../middleware/authValidation')

router.use("/:id/tasks", protect, taskRouter)

router.get("/", protect, getProjects)
router.get("/:id", protect, projectValidation, getProject)
router.put("/:id", protect, projectValidation, updateProject)
router.delete("/:id", protect, projectValidation, deleteProject)
router.post("/", protect, postValidation, addProject)

router.post("/:id/memebers", inviteAndAssign)

module.exports=router
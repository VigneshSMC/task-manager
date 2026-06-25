const express = require('express')
const router = express.Router()
const { getProjects, getProject, updateProject, addProject, deleteProject, inviteAndAssign } = require('../controller/projectController')
const idValidation = require('../middleware/idValidation')
const taskRouter = require('../router/taskRouter')

router.use("/:id/tasks", taskRouter)

router.get("/", getProjects)
router.get("/:id", idValidation, getProject)
router.put("/:id", idValidation, updateProject)
router.delete("/:id", idValidation, deleteProject)
router.post("/", addProject)

router.post("/:id/memebers", inviteAndAssign)

module.exports=router
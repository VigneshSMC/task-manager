const express = require('express')
const router = express.Router()
const { getProjects, getProject, updateProject, addProject, deleteProject } = require('../controller/projectController')
const projectValidation = require('../middleware/projectValidation')

router.get("/:id", projectValidation, getProject)
router.put("/:id", projectValidation, updateProject)
router.delete("/:id", projectValidation, deleteProject)
router.post("/", addProject)

// router.get("/:id/tasks", getTasks)
// router.delete("/:id/tasks", getTasks)
// router.get("/:id/tasks", getTasks)
// router.get("/:id/tasks", getTasks)

// router.get("/:id/members", getMembers)

module.exports=router
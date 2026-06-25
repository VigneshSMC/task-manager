const express = require('express')
const router = express.Router({mergeParams: true})

const { getTask, getTasks, deleteTask, updateTask, addTask } = require('../controller/taskController')
const idValidation = require('../middleware/idValidation')

router.get("/", getTasks)
router.get("/:taskId", idValidation, getTask)
router.delete("/:taskId", idValidation, deleteTask)
router.post("/", addTask)
router.put("/:taskId", idValidation, updateTask)

module.exports=router
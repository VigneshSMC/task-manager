const express = require('express')
const router = express.Router({mergeParams: true})

const { getTask, getTasks, deleteTask, updateTask, addTask } = require('../controller/taskController')
const { taskValidation } = require('../middleware/idValidation')

router.get("/", getTasks)
router.get("/:taskId", taskValidation, getTask)
router.delete("/:taskId", taskValidation, deleteTask)
router.post("/", addTask)
router.put("/:taskId", taskValidation, updateTask)

module.exports=router
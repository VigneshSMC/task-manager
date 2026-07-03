const Task = require('../models/Task')
const mongoose = require('mongoose')

exports.getTasks = async (req, res) => {
    try {
        const id = req.params.id
        const tasks = await Task.find({project_id: id})
        res.status(200).json({ message: "Tasks retrieved successfuly", body: tasks })
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.getTask = async (req, res) => {
    try {
        const id = req.params.taskId
        const task = await Task.findOne({_id: id})
        if (!Task) return res.status(404).json({error: " task id not available"})
        res.status(200).json({task})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.addTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, priority, status, user } = req.body
        const task = await Task.create({
            title,
            description,
            project_id: id,
            priority,
            status,
            user
        })
        res.status(201).json({task})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.updateTask = async (req, res) => {
    try {
        const projId = req.params.id
        const taskId = req.params.taskId
        const {title, description, priority, status, user} = req.body
        const updatedTask = await Task.findByIdAndUpdate(taskId, {title, description, project_id: projId, priority, status, user}, {new: true, runValidators: true})
        if (!updatedTask) return res.status(404).json({message: "task id not found"})
        res.status(200).json({message: "updated successfully", data: updatedTask})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
} 

exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.taskId
        const task = await Task.findByIdAndDelete(id)
        if (!task) return res.status(404).json({message: "task not found"})
        res.status(200).json({message: "deletion successful", data: task})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
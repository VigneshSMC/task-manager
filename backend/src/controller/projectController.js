const Project = require('../models/Project')
const mongoose = require('mongoose')

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        res.status(200).json({ message: "Projects retrieved successfuly", body: projects })
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.getProject = async (req, res) => {
    try {
        const id = req.params.id
        const project = await Project.findOne({_id: id})
        if (!project) return res.status(404).json({error: " project id not available"})
        res.status(200).json({project})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.addProject = async (req, res) => {
    try {
        const { name, description } = req.body
        const project = await Project.create({
            name,
            description
        })
        res.status(201).json({project})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}
exports.updateProject = async (req, res) => {
    try {
        const id = req.params.id
        const {name, description} = req.body
        const updatedProject = await Project.findByIdAndUpdate(id, {name, description}, {new: true, runValidators: true})
        if (!updatedProject) return res.status(404).json({message: "project id not found"})
        res.status(200).json({message: "updated successfully", data: updatedProject})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
} 

exports.deleteProject = async (req, res) => {
    try {
        const id = req.params.id
        const project = await Project.findByIdAndDelete(id)
        if (!project) return res.status(404).json({message: "project not found"})
        res.status(200).json({message: "deletion successful", data: project})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

exports.inviteAndAssign = async (req, res) => {
    
}
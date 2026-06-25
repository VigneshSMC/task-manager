const mongoose = require('mongoose')

const idValidation = (req, res, next) => {
    const id = req.params.id
    const taskId = req.params.taskId
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: "Invalid Project ID format" });
    }
    next()
}

module.exports=idValidation
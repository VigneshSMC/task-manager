const mongoose = require('mongoose')

const projectValidation = (req, res, next) => {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Project ID format" });
    }
    next()
}

module.exports=projectValidation
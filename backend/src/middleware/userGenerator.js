const User = require('../models/User')

const userGenerator = async (req, res, next) => {
    console.log(req.user)
    const { email, given_name } = req.user
    const user = await User.findOne({email})
    if (!user) await User.create({email, name: given_name})
    next()
    console.log(email)
}

module.exports=userGenerator
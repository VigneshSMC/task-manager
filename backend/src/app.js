const express = require('express')
const app = express()
const authRouter = require('./router/authRouter')
const projectRouter = require('./router/projectRouter')
const userRouter = require('./router/userRouter')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use("/auth", authRouter)
app.use("/projects", projectRouter)
app.use("/users", userRouter)

app.get('/', (req, res) => {
    res.send("Welcome to task manager API")
})

module.exports=app
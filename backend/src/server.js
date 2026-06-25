const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server is running"))

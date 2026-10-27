import express from 'express' 
import dotenv from 'dotenv'
import { mongooseConnect } from './DB/mongoose.js'
import dns from 'dns'
import { globalErrorHandler } from './middlewares/errorHandler.js'
import userRouter from './routes/user.routes.js' 

dns.setServers(["8.8.8.8", "8.8.4.4"])
dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
mongooseConnect()

app.get('/', (req, res) => {
  res.json({ message: "Server is running successfully! 🚀" })
})

app.use('/users', userRouter)

app.use(globalErrorHandler)

app.listen(port, () => { 
  console.log(`Server is running on port ${port}`) 
})
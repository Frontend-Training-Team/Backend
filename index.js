import express from 'express'
import dotenv from 'dotenv'
import { mongooseConnect } from './DB/mongoose.js'
import dns from 'dns'
import { notFound, globalErrorHandler } from './middleware/errorHandler.js';
import userRouter from './routes/userRoutes.js'

dns.setServers(["8.8.8.8", "8.8.4.4"])
dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
mongooseConnect()

app.use('/users', userRouter);

app.use(notFound);
app.use(globalErrorHandler); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

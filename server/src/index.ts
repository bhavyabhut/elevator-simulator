import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'

import elevatorRoutes from './routes/elevatorRoutes'
import { ELEVATOR_ROUTE } from './constant'
import { getElevatorStateFromDB } from './service/elevatorService'

dotenv.config()

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in the environment variables')
  process.exit(1)
}

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.use(ELEVATOR_ROUTE, elevatorRoutes)

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected successfully')

    await getElevatorStateFromDB()

    server.listen(PORT, () => {
      console.log(`Elevator Simulator API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(
      'Error while starting the server or connecting to MongoDB:',
      error
    )
    process.exit(1)
  }
}

startServer()

export default app

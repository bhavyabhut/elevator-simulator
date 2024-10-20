import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import elevatorRoutes from './routes/elevatorRoutes'
import { ELEVATOR_ROUTE } from './constant'
import { getElevatorStateFromDB } from './service/elevatorService'

dotenv.config()

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI || ''

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(ELEVATOR_ROUTE, elevatorRoutes)

// Connect to MongoDB and Start Server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')
    try {
      // Ensure elevator state exists in the database
      await getElevatorStateFromDB()

      // Start the server
      server.listen(PORT, () => {
        console.log(
          `Elevator Simulator API running on http://localhost:${PORT}`
        )
      })
    } catch (error) {
      console.error('Error while creating first elevator in DB', error)
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

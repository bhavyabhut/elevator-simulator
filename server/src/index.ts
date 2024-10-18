import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
// import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

import elevatorRoutes from './routes/elevatorRoutes'
import { getElevatorStateFromDB } from './service/elevatorService'
// import { socketHandler } from './socketHandler'

dotenv.config()

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI || ''
const ELEVATOR_ROUTE = '/api/elevator'

const app = express()
const server = http.createServer(app)
// const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(ELEVATOR_ROUTE, elevatorRoutes)

// Connect to MongoDB and Start Server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')

    // Ensure elevator state exists in the database
    await getElevatorStateFromDB()

    // Use the socket handler for WebSocket events
    // socketHandler(io)

    // Start the server
    server.listen(PORT, () => {
      console.log(`Elevator Simulator API running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

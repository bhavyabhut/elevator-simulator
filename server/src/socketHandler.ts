import { Server, Socket } from 'socket.io'
import Elevator from './models/elevatorModel'
import {
  addRequestToQueue,
  processElevatorRequests,
  getElevatorStateFromDB
} from './service/elevatorService'

// Function to handle socket connections
export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id)

    // Send initial elevator state to the client
    getElevatorStateFromDB().then((state) => {
      socket.emit('elevatorState', state)
    })

    // Handle the call elevator event via WebSocket
    socket.on('callElevator', async (floor: number) => {
      try {
        const elevator = await Elevator.findOne()
        if (elevator) {
          await addRequestToQueue(elevator, floor)
          await processElevatorRequests()
          await elevator.save()

          // Emit the updated elevator state to all connected clients
          io.emit('elevatorState', elevator)
        }
      } catch (error) {
        console.error('Error handling callElevator event:', error)
      }
    })

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

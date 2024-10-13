import { Request, Response } from 'express'
import Elevator from '../models/elevatorModel'
import { TOTAL_FLOORS } from '../constant'
import {
  addRequestToQueue,
  processElevatorRequests
} from '../service/elevatorService'
import { MESSAGES } from '../constant/errors'

// API to get the elevator state
export const getElevatorState = async (req: Request, res: Response) => {
  try {
    const elevator = await Elevator.findOne()
    if (!elevator) {
      return res.status(404).json({ message: MESSAGES.ELEVATOR_NOT_FOUND })
    }
    return res.json(elevator)
  } catch (error) {
    console.error(MESSAGES.ELEVATOR_FETCH_ERROR, error)
    return res
      .status(500)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR, error })
  }
}

// API to call the elevator to a specific floor
export const callElevator = async (req: Request, res: Response) => {
  try {
    const { floor } = req.body

    if (typeof floor !== 'number' || floor < 0 || floor > TOTAL_FLOORS) {
      return res.status(400).json({ message: 'Invalid floor number.' })
    }

    const elevator = await Elevator.findOne()

    if (!elevator) {
      console.log(MESSAGES.ELEVATOR_NOT_FOUND)
      return res.status(404).json({ message: MESSAGES.ELEVATOR_NOT_FOUND })
    }

    // Add the floor request to the queue
    const updatedElevator = await addRequestToQueue(elevator, floor)

    // Return response immediately (non-blocking)
    res.json({
      message: 'Request added to queue, elevator will move shortly.',
      elevator: updatedElevator
    })

    // Trigger request processing asynchronously
    await processElevatorRequests()
  } catch (error) {
    console.error(MESSAGES.ELEVATOR_FETCH_ERROR, error)
    return res
      .status(500)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR, error })
  }
}

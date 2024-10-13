import Elevator, { IElevator } from '../models/elevatorModel'
import { DOOR_OPEN_TIME, DOWN, TIME_TO_REACH_FLOOR, UP } from '../constant'
import { MESSAGES } from '../constant/errors'
import { delay } from '../utils'

const updateElevatorState = async (
  updates: Partial<IElevator>
): Promise<IElevator> => {
  try {
    const elevator = await Elevator.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true }
    )
    console.log('Elevator state updated:', updates)
    return elevator!
  } catch (error) {
    console.error(MESSAGES.ELEVATOR_UPDATE_ERROR, error)
    throw new Error(MESSAGES.ELEVATOR_UPDATE_ERROR)
  }
}

export const getElevatorStateFromDB = async (): Promise<IElevator> => {
  try {
    let elevator = await Elevator.findOne()
    if (!elevator) {
      elevator = new Elevator()
      await elevator.save()
    }
    return elevator
  } catch (error) {
    console.error(MESSAGES.ELEVATOR_FETCH_ERROR, error)
    throw new Error(MESSAGES.ELEVATOR_FETCH_ERROR)
  }
}

export const addRequestToQueue = async (elevator: IElevator, floor: number) => {
  try {
    const updates: Partial<IElevator> = {}

    if (elevator.currentFloor < floor && !elevator.upQueue.includes(floor)) {
      updates.upQueue = [...elevator.upQueue, floor].sort((a, b) => a - b)
    } else if (
      elevator.currentFloor > floor &&
      !elevator.downQueue.includes(floor)
    ) {
      updates.downQueue = [...elevator.downQueue, floor].sort((a, b) => b - a)
    }

    if (Object.keys(updates).length > 0) {
      return await updateElevatorState(updates)
    }
  } catch (error) {
    console.error('Error adding request to queue:', error)
  }
}

export const getInitialDirection = (elevator: IElevator) => {
  try {
    if (elevator.upQueue.length === 0 && elevator.downQueue.length === 0) {
      return null
    }

    const closestUp =
      elevator.upQueue.length > 0 ? Math.min(...elevator.upQueue) : Infinity
    const closestDown =
      elevator.downQueue.length > 0
        ? Math.max(...elevator.downQueue)
        : -Infinity

    // If the closest down request is below the current floor, prioritize down
    if (
      closestDown < elevator.currentFloor &&
      closestUp > elevator.currentFloor
    ) {
      return elevator.currentFloor - closestDown <=
        closestUp - elevator.currentFloor
        ? DOWN
        : UP
    }

    // Prioritize the closest up request if it exists and is above the current floor
    if (closestUp > elevator.currentFloor) {
      return UP
    }

    // Otherwise, prioritize the closest down request if it's below the current floor
    if (closestDown < elevator.currentFloor) {
      return DOWN
    }

    // Edge case handling: if both are at the same distance or elevator is already at the closest floor
    return null
  } catch (error) {
    console.error('Error getting initial direction:', error)
    return null // Fallback to null on error
  }
}

// Process elevator movement and requests
export const processElevatorRequests = async () => {
  try {
    let elevator = await getElevatorStateFromDB()

    if (elevator.moving) {
      console.log('Elevator is already moving, skipping request processing.')
      return
    }

    // Determine the initial direction if not already set
    if (!elevator.direction) {
      const direction = getInitialDirection(elevator)
      elevator = await updateElevatorState({
        direction,
        moving: true
      })
    }

    while (elevator.upQueue.length || elevator.downQueue.length) {
      // TODO
      elevator = await getElevatorStateFromDB()
      if (!elevator) break
      if (elevator.direction === UP) {
        await processNextUpRequest()
      } else if (elevator.direction === DOWN) {
        await processNextDownRequest()
      }
    }

    // Mark elevator as idle
    await updateElevatorState({ moving: false, direction: null })
    // Completed All Tasks
    console.log('Elevator has completed all requests.')
  } catch (error) {
    console.error('Error processing elevator requests:', error)
  }
}

// Process the next UP request
const processNextUpRequest = async (): Promise<void> => {
  try {
    const elevator = await getElevatorStateFromDB()
    if (!elevator || elevator.upQueue.length === 0) return // No up requests

    const nextFloor = Math.min(...elevator.upQueue) // Nearest up request

    await moveElevatorToFloor(nextFloor)
  } catch (error) {
    console.error('Error processing next up request:', error)
  }
}

// Process the next DOWN request
const processNextDownRequest = async () => {
  try {
    const elevator = await getElevatorStateFromDB()
    if (elevator.downQueue.length === 0) return

    const nextFloor = Math.max(...elevator.downQueue)

    await moveElevatorToFloor(nextFloor)
  } catch (error) {
    console.error('Error processing next down request:', error)
  }
}

// Move elevator to a specified floor
const moveElevatorToFloor = async (targetFloor: number): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const elevator = await getElevatorStateFromDB()
        if (elevator.currentFloor === targetFloor) {
          clearInterval(interval)
          await elevatorArriveAtFloor(targetFloor)
          resolve()
        } else {
          const updatedFloor =
            elevator.currentFloor < targetFloor
              ? elevator.currentFloor + 1
              : elevator.currentFloor - 1

          await updateElevatorState({
            currentFloor: updatedFloor
          })
        }
      } catch (error) {
        console.error('Error moving elevator:', error)
        clearInterval(interval)
        resolve()
      }
    }, TIME_TO_REACH_FLOOR * 1000) // 3 seconds per floor
  })
}

// Handle arrival at the floor
const elevatorArriveAtFloor = async (targetFloor: number) => {
  try {
    let elevator = await getElevatorStateFromDB()

    const updates: Partial<IElevator> = {}

    if (elevator.upQueue.includes(targetFloor)) {
      updates.upQueue = elevator.upQueue.filter(
        (floor) => floor !== targetFloor
      )
    } else if (elevator.downQueue.includes(targetFloor)) {
      updates.downQueue = elevator.downQueue.filter(
        (floor) => floor !== targetFloor
      )
    }

    console.log(`Elevator arrived at floor ${targetFloor}. Doors opening...`)
    elevator = await updateElevatorState({
      ...updates,
      moving: false,
      doorsOpen: true
    })

    // Wait for 2 seconds to simulate door opening
    await delay(DOOR_OPEN_TIME * 1000)

    // Step 2: Door closes after another 2 seconds
    console.log(`Doors closing at floor ${targetFloor}...`)

    // Only update direction if there are remaining requests
    if (elevator.upQueue.length > 0 || elevator.downQueue.length > 0) {
      const direction = getInitialDirection(elevator)
      updates.direction = direction
      if (direction) {
        updates.moving = true
        updates.doorsOpen = false
      }
    } else {
      updates.direction = null
    }
    await updateElevatorState({ ...updates, doorsOpen: false })
  } catch (error) {
    console.error('Error handling arrival at floor:', error)
  }
}

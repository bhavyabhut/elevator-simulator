import Elevator, { IElevator } from '../models/elevatorModel'
import { DOOR_OPEN_TIME, DOWN, TIME_TO_REACH_FLOOR, UP } from '../constant'
import { MESSAGES } from '../constant/errors'
import { delay } from '../utils'
import { Direction } from '../types'

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
  console.log('🚀 ~ addRequestToQueue ~ elevator:', elevator, floor)
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
    console.log('🚀 ~ addRequestToQueue ~ updates:', updates)

    if (Object.keys(updates).length > 0) {
      elevator = await updateElevatorState(updates)
      const { direction, targetFloor } = getInitialDirection(elevator)

      if (
        targetFloor === elevator.targetFloor &&
        direction === elevator.direction
      )
        return elevator
      else if (
        direction === elevator.direction ||
        elevator.targetFloor === null
      )
        return await updateElevatorState({
          targetFloor
        })
      else return elevator
    }
  } catch (error) {
    console.error('Error adding request to queue:', error)
  }
}

export const getInitialDirection = (
  elevator: IElevator
): { direction: Direction; targetFloor: number | null } => {
  try {
    if (elevator.upQueue.length === 0 && elevator.downQueue.length === 0) {
      return { direction: null, targetFloor: null }
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
        ? { direction: DOWN, targetFloor: closestDown }
        : { direction: UP, targetFloor: closestUp }
    }

    // Prioritize the closest up request if it exists and is above the current floor
    if (closestUp > elevator.currentFloor) {
      return { direction: UP, targetFloor: closestUp }
    }

    // Otherwise, prioritize the closest down request if it's below the current floor
    if (closestDown < elevator.currentFloor) {
      return { direction: DOWN, targetFloor: closestDown }
    }

    // Edge case handling: if both are at the same distance or elevator is already at the closest floor
    return { direction: null, targetFloor: null }
  } catch (error) {
    console.error('Error getting initial direction:', error)
    return { direction: null, targetFloor: null } // Fallback to null on error
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
      const { direction, targetFloor } = getInitialDirection(elevator)
      elevator = await updateElevatorState({
        direction,
        targetFloor,
        moving: true
      })
    }

    while (elevator.upQueue.length || elevator.downQueue.length) {
      elevator = await getElevatorStateFromDB()
      if (!elevator) break
      if (elevator.direction === UP) {
        if (elevator.upQueue.length === 0) return
        await moveElevatorToFloor()
      } else if (elevator.direction === DOWN) {
        if (elevator.downQueue.length === 0) return
        await moveElevatorToFloor()
      }
    }

    // Mark elevator as idle
    await updateElevatorState({
      moving: false,
      direction: null,
      targetFloor: null
    })
    // Completed All Tasks
    console.log('Elevator has completed all requests.')
  } catch (error) {
    console.error('Error processing elevator requests:', error)
  }
}

// Move elevator to a specified floor
const moveElevatorToFloor = async (): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const elevator = await getElevatorStateFromDB()
        if (elevator.currentFloor === elevator.targetFloor) {
          clearInterval(interval)
          await elevatorArriveAtFloor(elevator.targetFloor)
          resolve()
        } else {
          const updatedFloor =
            elevator.currentFloor < (elevator.targetFloor || 0)
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
      const { direction, targetFloor } = getInitialDirection(elevator)
      updates.direction = direction
      if (direction) {
        updates.moving = true
        updates.doorsOpen = false
        updates.targetFloor = targetFloor
      }
    } else {
      updates.direction = null
      updates.targetFloor = null
      updates.moving = false
    }
    await updateElevatorState({
      ...updates,
      doorsOpen: false
    })
  } catch (error) {
    console.error('Error handling arrival at floor:', error)
  }
}

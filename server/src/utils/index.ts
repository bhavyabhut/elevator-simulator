import { IElevator } from '../models/elevatorModel'

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const isFloorInQueue = (elevator: IElevator, floor: number) => {
  return (
    !elevator.upQueue.includes(floor) && !elevator.downQueue.includes(floor)
  )
}

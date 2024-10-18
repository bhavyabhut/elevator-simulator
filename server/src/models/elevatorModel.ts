import mongoose, { Document, Schema } from 'mongoose'
import { TOTAL_FLOORS } from '../constant'
import { Direction } from '../types'

export interface IElevator extends Document {
  _id: string
  currentFloor: number
  direction: Direction
  doorsOpen: boolean
  upQueue: number[]
  downQueue: number[]
  moving: boolean
  totalFloors: number
  targetFloor: number | null
}

const elevatorSchema: Schema = new Schema({
  currentFloor: {
    type: Number,
    default: 1,
    min: 1,
    max: TOTAL_FLOORS
  },
  direction: {
    type: String,
    enum: ['up', 'down', null],
    default: null
  },
  doorsOpen: { type: Boolean, default: false },
  upQueue: {
    type: [Number],
    default: [],
    validate: {
      validator: function (value: number[]) {
        return value.every((floor) => floor >= 1 && floor <= TOTAL_FLOORS)
      },
      message: `Floors in upQueue must be between 1 and ${TOTAL_FLOORS}`
    }
  },
  downQueue: {
    type: [Number],
    default: [],
    validate: {
      validator: function (value: number[]) {
        return value.every((floor) => floor >= 1 && floor <= TOTAL_FLOORS)
      },
      message: `Floors in downQueue must be between 1 and ${TOTAL_FLOORS}`
    }
  },
  moving: { type: Boolean, default: false },
  targetFloor: {
    type: Number,
    default: null,
    min: 1,
    max: TOTAL_FLOORS
  },
  totalFloors: { type: Number, default: TOTAL_FLOORS }
})

const Elevator = mongoose.model<IElevator>('Elevator', elevatorSchema)
export default Elevator

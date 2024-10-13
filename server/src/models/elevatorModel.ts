import mongoose, { Document, Schema } from 'mongoose'
import { TOTAL_FLOORS } from '../constant'

export interface IElevator extends Document {
  _id: string
  currentFloor: number
  direction: 'up' | 'down' | null
  doorsOpen: boolean
  upQueue: number[]
  downQueue: number[]
  moving: boolean
  totalFloors: number
}

const elevatorSchema: Schema = new Schema({
  currentFloor: {
    type: Number,
    default: 0,
    min: 0,
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
        return value.every((floor) => floor >= 0 && floor <= TOTAL_FLOORS)
      },
      message: `Floors in upQueue must be between 0 and ${TOTAL_FLOORS}`
    }
  },
  downQueue: {
    type: [Number],
    default: [],
    validate: {
      validator: function (value: number[]) {
        return value.every((floor) => floor >= 0 && floor <= TOTAL_FLOORS)
      },
      message: `Floors in downQueue must be between 0 and ${TOTAL_FLOORS}`
    }
  },
  moving: { type: Boolean, default: false },
  totalFloors: { type: Number, default: TOTAL_FLOORS }
})

const Elevator = mongoose.model<IElevator>('Elevator', elevatorSchema)
export default Elevator

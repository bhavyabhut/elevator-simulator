import { Router } from 'express'
import {
  callElevator,
  getElevatorState
} from '../controllers/elevatorController'

const router = Router()

router.get('/state', getElevatorState)
router.post('/call', callElevator)

export default router

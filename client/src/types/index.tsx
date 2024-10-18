import { DOWN, UP } from '../constant';

export interface Elevator {
    _id: string;
    currentFloor: number;
    direction: Direction;
    doorsOpen: boolean;
    upQueue: number[];
    downQueue: number[];
    moving: boolean;
    totalFloors: number;
    targetFloor: number | null;
}

export type UpDown = typeof UP | typeof DOWN;

export type Direction = 'up' | 'down' | null;

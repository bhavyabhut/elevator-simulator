import { Direction } from '../../../../types';

export interface FloorProps {
    floorNumber: number;
    currentFloor: number;
    moveElevator: (floor: number) => void;
    height: number;
    direction: Direction;
    isUpPressed: boolean;
    isDownPressed: boolean;
    handleButtonPress: (floor: number, direction: Direction) => void;
    totalFloors: number;
}

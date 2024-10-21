import { motion } from 'framer-motion';

import ElevatorBox from '../Box';

import { TIME_TO_REACH_FLOOR, TOTAL_FLOOR_HEIGHT } from '../../../../constant';

const ElevatorColumn = ({
    currentFloor,
    targetFloor,
    doorOpen,
    totalFloors
}: {
    currentFloor: number;
    targetFloor: number | null;
    doorOpen: boolean;
    totalFloors: number;
}) => {
    const floorHeight = TOTAL_FLOOR_HEIGHT;
    const totalHeight = totalFloors * floorHeight + totalFloors * 16;
    const elevatorBoxTopPosition =
        totalFloors === currentFloor
            ? 0
            : currentFloor === 1
              ? totalHeight - floorHeight - 16
              : (totalFloors - currentFloor) * floorHeight + (totalFloors - currentFloor) * 16;
    return (
        <div
            className="relative w-32 bg-blue-800 rounded-lg shadow-lg border border-gray-300"
            style={{ height: `${totalHeight}px` }}>
            <motion.div
                className="absolute w-full"
                style={{
                    top: `${elevatorBoxTopPosition}px`,
                    height: `${floorHeight}px`
                }}
                animate={{
                    top:
                        targetFloor !== null && !doorOpen
                            ? `${(totalFloors - targetFloor) * floorHeight + (totalFloors - currentFloor) * 16}px`
                            : `${elevatorBoxTopPosition}px`
                }}
                transition={{
                    duration: Math.abs(currentFloor - (targetFloor || 0)) * TIME_TO_REACH_FLOOR,
                    ease: 'linear'
                }}>
                <ElevatorBox doorOpen={doorOpen} />
            </motion.div>
        </div>
    );
};

export default ElevatorColumn;

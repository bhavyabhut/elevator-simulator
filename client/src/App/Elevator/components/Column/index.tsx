import { motion } from 'framer-motion';
import ElevatorBox from '../Box';
import { TIME_TO_REACH_FLOOR, TOTAL_FLOOR_HEIGHT } from '../../../../constant';

const ElevatorColumn = ({
    currentFloor,
    targetFloor,
    doorOpen,
    moving,
    totalFloors
}: {
    currentFloor: number; // This should be 1-indexed
    targetFloor: number | null; // This can also be 1-indexed or null
    doorOpen: boolean;
    moving: boolean;
    totalFloors: number; // Total floors, 1-indexed
}) => {
    const floorHeight = TOTAL_FLOOR_HEIGHT;
    const totalHeight = totalFloors * floorHeight + totalFloors * 16;
    const elevatorBoxTopPosition =
        totalFloors === currentFloor
            ? 0
            : currentFloor === 1
              ? totalHeight - floorHeight
              : (totalFloors - currentFloor) * floorHeight + (totalFloors - currentFloor) * 16;
    return (
        <div
            className="relative w-32 bg-blue-800 rounded-lg shadow-lg border border-gray-300"
            style={{ height: `${totalHeight}px` }} // Correct height based on floors and margins
        >
            {/* Elevator box */}

            <motion.div
                className="absolute w-full"
                style={{
                    top: `${elevatorBoxTopPosition}px`, // Adjusted position
                    height: `${floorHeight}px`
                }}
                animate={{
                    top:
                        targetFloor !== null
                            ? `${(totalFloors - targetFloor) * floorHeight + (totalFloors - currentFloor) * 16}px` // Adjust for target floor
                            : `${elevatorBoxTopPosition}px` // Stay at current position when idle
                }}
                transition={{
                    duration: Math.abs(currentFloor - (targetFloor || 0)) * TIME_TO_REACH_FLOOR, // No animation when idle
                    ease: 'linear'
                }}>
                <ElevatorBox doorOpen={doorOpen} />
            </motion.div>
        </div>
    );
};

export default ElevatorColumn;

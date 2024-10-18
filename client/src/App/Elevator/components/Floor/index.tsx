import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FloorProps {
    floorNumber: number;
    currentFloor: number;
    moveElevator: (floor: number) => void;
    height: number; // Accept height as a prop
}

const Floor: React.FC<FloorProps> = ({ floorNumber, currentFloor, moveElevator, height }) => {
    const isCurrentFloor = currentFloor === floorNumber;
    const direction = currentFloor < floorNumber ? <FaArrowUp /> : <FaArrowDown />;

    return (
        <div
            className="bg-gray-200 rounded-xl p-4 flex items-center justify-between mb-4 shadow-md"
            style={{ height: `${height}px` }} // Dynamically set height
        >
            {/* Floor Number */}
            <div className="text-gray-700 font-semibold text-lg">Floor {floorNumber}</div>
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-800 text-white rounded-md flex items-center justify-center">
                    {isCurrentFloor && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center">
                            {direction}
                            <span>{floorNumber}</span>
                        </motion.div>
                    )}
                    {!isCurrentFloor && <span>{floorNumber}</span>}
                </div>
                <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCurrentFloor
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                    } shadow-lg`}
                    onClick={() => !isCurrentFloor && moveElevator(floorNumber)}
                    disabled={isCurrentFloor}>
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
};

export default Floor;

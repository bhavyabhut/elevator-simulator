import { motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

import { DOWN, UP } from '../../../../constant';
import { FloorProps } from './type';

const Floor: React.FC<FloorProps> = ({
    floorNumber,
    currentFloor,
    moveElevator,
    height,
    direction,
    isUpPressed,
    isDownPressed,
    handleButtonPress,
    totalFloors
}) => {
    const directionIcon = direction ? direction === UP ? <FaArrowUp /> : <FaArrowDown /> : null;
    const disabled = floorNumber === currentFloor;
    return (
        <div
            className="bg-gray-200 rounded-xl p-4 flex items-center justify-between mb-4 shadow-md"
            style={{ height: `${height}px` }}>
            <div className="text-gray-700 font-semibold text-lg">Floor {floorNumber}</div>
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-800 text-white rounded-md flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center">
                        {directionIcon}
                        <span>{currentFloor}</span>
                    </motion.div>
                </div>
                <div className="flex items-center justify-center flex-col">
                    {floorNumber !== totalFloors && (
                        <button
                            className={`w-10 h-10 mb-1 rounded-full flex items-center justify-center ${
                                isUpPressed
                                    ? 'border bg-gradient-to-r from-green-400 to-green-200 border-indigo-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                            } ${disabled && 'cursor-not-allowed'} shadow-lg`}
                            onClick={() => {
                                if (!isUpPressed && !disabled) {
                                    moveElevator(floorNumber);
                                    handleButtonPress(floorNumber, UP);
                                }
                            }}
                            disabled={isUpPressed || disabled}>
                            <FaArrowUp />
                        </button>
                    )}
                    {floorNumber !== 1 && (
                        <button
                            className={`w-10 h-10 mb-1 rounded-full flex items-center justify-center  ${
                                isDownPressed
                                    ? 'border bg-gradient-to-r from-green-400 to-green-200 border-indigo-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                            } ${disabled && 'cursor-not-allowed'}  shadow-lg`}
                            onClick={() => {
                                if (!isDownPressed && !disabled) {
                                    moveElevator(floorNumber);
                                    handleButtonPress(floorNumber, DOWN);
                                }
                            }}
                            disabled={isDownPressed}>
                            <FaArrowDown />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Floor;

import { motion } from 'framer-motion';

const ElevatorDoors = ({ doorOpen }: { doorOpen: boolean }) => {
    return (
        <div className="relative w-full h-full flex justify-center">
            <motion.div
                className="absolute left-0 h-full w-1/2 bg-blue-300"
                animate={{ x: doorOpen ? '-50%' : '0%' }} // Open doors
                transition={{ duration: 0.8 }}
            />
            <motion.div
                className="absolute right-0 h-full w-1/2 bg-blue-300"
                animate={{ x: doorOpen ? '50%' : '0%' }} // Open doors
                transition={{ duration: 0.8 }}
            />
        </div>
    );
};

export default ElevatorDoors;

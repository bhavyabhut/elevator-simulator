import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="text-center">
                <motion.div
                    className="text-7xl mb-4"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear'
                    }}>
                    ⏳
                </motion.div>

                <motion.h1
                    className="text-3xl font-semibold text-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}>
                    Please wait while the elevator is arriving...
                </motion.h1>

                <motion.div
                    className="mt-6 flex justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}>
                    <motion.div
                        className="w-4 h-4 bg-blue-500 rounded-full"
                        animate={{ y: [-10, 10] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <motion.div
                        className="w-4 h-4 bg-blue-500 rounded-full"
                        animate={{ y: [-10, 10] }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                    />
                    <motion.div
                        className="w-4 h-4 bg-blue-500 rounded-full"
                        animate={{ y: [-10, 10] }}
                        transition={{
                            duration: 0.5,
                            delay: 0.4,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingScreen;

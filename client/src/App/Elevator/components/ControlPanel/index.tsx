import { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { TIME_TO_REACH_FLOOR } from '../../../../constant';

const ControlPanel = ({
    currentFloor,
    targetFloor,
    moving,
    doorOpen
}: {
    currentFloor: number;
    targetFloor: number | null;
    moving: boolean;
    doorOpen: boolean;
}) => {
    const [timeToReach, setTimeToReach] = useState<number | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (targetFloor !== null && moving) {
            const totalTime = Math.abs(currentFloor - targetFloor) * TIME_TO_REACH_FLOOR;
            setTimeToReach(totalTime);

            interval = setInterval(() => {
                setTimeToReach((prevTime) => {
                    if (prevTime && prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        clearInterval(interval!);
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [currentFloor, targetFloor, moving]);

    return (
        <div className="w-full md:w-80 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-2xl border border-gray-400">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">🚀 Control Panel</h2>
            <div className="space-y-5 text-lg">
                <p className="flex justify-between items-center">
                    <strong>Current Floor:</strong>
                    <span className="text-blue-600">{currentFloor} 🏢</span>
                </p>
                <p className="flex justify-between items-center">
                    <strong>Target Floor:</strong>
                    <span className="text-purple-600">
                        {targetFloor ?? 'None'}{' '}
                        {targetFloor ? (
                            currentFloor === targetFloor ? null : currentFloor < targetFloor ? (
                                <FaArrowUp className="inline text-green-600" />
                            ) : (
                                <FaArrowDown className="inline text-red-600" />
                            )
                        ) : (
                            '📍'
                        )}
                    </span>
                </p>
                <p className="flex justify-between items-center">
                    <strong>Status:</strong>
                    <span
                        className={`text-lg font-semibold ${moving ? 'text-yellow-500' : 'text-green-600'}`}>
                        {moving ? '🚧 Moving...' : '🟢 Stopped'}
                    </span>
                </p>
                <p className="flex justify-between items-center">
                    <strong>Doors:</strong>
                    {doorOpen ? (
                        <span className="text-green-600 flex items-center">
                            Open <FaDoorOpen className="ml-2" />
                        </span>
                    ) : (
                        <span className="text-red-600 flex items-center">
                            Closed <FaDoorClosed className="ml-2" />
                        </span>
                    )}
                </p>
                <p className="flex justify-between items-center">
                    <strong>Time to Target:</strong>
                    <span className="text-gray-800">
                        {timeToReach !== null ? `${timeToReach} sec ⏱️` : 'N/A'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ControlPanel;

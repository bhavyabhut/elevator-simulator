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
    const timeToReach = targetFloor
        ? Math.abs(currentFloor - targetFloor) * TIME_TO_REACH_FLOOR
        : 0; // 3 seconds per floor

    return (
        <div className="w-64 p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Control Panel</h2>
            <div className="space-y-4">
                <p>
                    <strong>Current Floor:</strong>{' '}
                    <span className="text-blue-600">{currentFloor}</span>
                </p>
                <p>
                    <strong>Target Floor:</strong>{' '}
                    <span className="text-blue-600">{targetFloor}</span>
                </p>
                <p>
                    <strong>Status:</strong>{' '}
                    {moving ? (
                        <span className="text-yellow-500">Moving...</span>
                    ) : (
                        <span className="text-green-600">Stopped</span>
                    )}
                </p>
                <p>
                    <strong>Doors:</strong>{' '}
                    {doorOpen ? (
                        <span className="text-green-600">Open</span>
                    ) : (
                        <span className="text-red-600">Closed</span>
                    )}
                </p>
                <p>
                    <strong>Time to Target:</strong> {timeToReach} seconds
                </p>
            </div>
        </div>
    );
};

export default ControlPanel;

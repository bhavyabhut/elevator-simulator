import { useState, useEffect } from 'react';
import Floor from '../components/Floor';
import ElevatorColumn from '../components/Column';
import ControlPanel from '../components/ControlPanel';
import { Elevator } from '../../../types';
import { fetchElevatorStateAPI, postElevatorCallAPI } from '../../../api';
import { TOTAL_FLOOR_HEIGHT } from '../../../constant';

const ElevatorSimulator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [elevatorData, setElevatorData] = useState<Elevator>();
    console.log('🚀 ~ ElevatorSimulator ~ elevatorData:', elevatorData);

    const moveElevator = async (floor: number) => {
        try {
            const response = await postElevatorCallAPI(floor);
            if (response && response.data && response.data.elevator) {
                setElevatorData(response.data.elevator);
            }
        } catch (error) {
            console.error('Error calling the elevator:', error);
        }
    };

    const fetchElevatorState = async (isInitialCall?: boolean) => {
        if (isInitialCall) setIsLoading(true);
        const response = await fetchElevatorStateAPI();
        const elevatorData = response?.data;
        console.log('🚀 ~ fetchElevatorState ~ elevatorData:', elevatorData);
        setElevatorData(elevatorData);
        if (isInitialCall && isLoading) setIsLoading(false);
    };

    useEffect(() => {
        fetchElevatorState(true);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(fetchElevatorState, 1000); // Fetch every 2 seconds
        return () => clearInterval(intervalId); // Cleanup the interval on unmount
    }, []);

    if (isLoading || !elevatorData) return <>Loading....</>;

    const { currentFloor, doorsOpen, moving, targetFloor, totalFloors } = elevatorData;

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
            <div className="flex space-x-8">
                <div className="flex space-x-8">
                    <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-200">
                        {Array.from({ length: totalFloors }, (_, i) => totalFloors - i).map(
                            (floor) => (
                                <Floor
                                    key={floor}
                                    floorNumber={floor}
                                    currentFloor={currentFloor}
                                    moveElevator={moveElevator}
                                    height={TOTAL_FLOOR_HEIGHT}
                                />
                            )
                        )}
                    </div>
                    <ElevatorColumn
                        totalFloors={totalFloors}
                        currentFloor={currentFloor}
                        targetFloor={targetFloor}
                        doorOpen={doorsOpen}
                        moving={moving}
                    />
                </div>
                <ControlPanel
                    currentFloor={currentFloor}
                    targetFloor={targetFloor}
                    moving={moving}
                    doorOpen={doorsOpen}
                />
            </div>
        </div>
    );
};

export default ElevatorSimulator;

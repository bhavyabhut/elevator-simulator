import { useQuery, useQueryClient } from '@tanstack/react-query';

import ElevatorColumn from '../components/Column';
import ControlPanel from '../components/ControlPanel';
import { Elevator } from '../../../types';
import { fetchElevatorStateAPI, postElevatorCallAPI } from '../../../api';
import LoadingScreen from '../components/Loading';
import Building from '../components/Building';
import { REFETCH_INTERVAL, STALE_TIME } from '../../../constant';

const ElevatorSimulator = () => {
    const queryClient = useQueryClient();
    const { data: elevator, isLoading } = useQuery({
        queryKey: ['elevatorState'],
        queryFn: fetchElevatorStateAPI,
        refetchInterval: REFETCH_INTERVAL * 1000,
        staleTime: STALE_TIME * 1000
    });

    const moveElevator = async (floor: number) => {
        try {
            const elevator = await postElevatorCallAPI(floor);
            if (elevator) {
                queryClient.setQueryData(['elevatorState'], (_: Elevator) => elevator);
            }
        } catch (error) {
            console.error('Error moving elevator:', error);
        }
    };

    if (isLoading || !elevator) return <LoadingScreen />;

    const { currentFloor, doorsOpen, moving, targetFloor, totalFloors, direction } = elevator;

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200">
            <div className="flex space-x-8">
                <div className="flex space-x-8">
                    <div className="w-[500px] bg-white rounded-lg shadow-lg border border-gray-200">
                        <Building
                            totalFloors={totalFloors}
                            currentFloor={currentFloor}
                            moveElevator={moveElevator}
                            direction={direction}
                            targetFloor={targetFloor}
                        />
                    </div>
                    <ElevatorColumn
                        totalFloors={totalFloors}
                        currentFloor={currentFloor}
                        targetFloor={targetFloor}
                        doorOpen={doorsOpen}
                    />
                </div>
            </div>
            <div className="mx-10 ">
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

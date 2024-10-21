import { useEffect, useState } from 'react';
import { TOTAL_FLOOR_HEIGHT } from '../../../../constant';
import { Direction } from '../../../../types';
import Floor from '../Floor';

const Building = ({
    currentFloor,
    moveElevator,
    totalFloors,
    direction,
    targetFloor
}: {
    currentFloor: number;
    totalFloors: number;
    direction: Direction;
    targetFloor: number | null;
    moveElevator: (floor: number) => Promise<void>;
}) => {
    const [floorButtons, setFloorButtons] = useState<{
        [key: number]: { up: boolean; down: boolean };
    }>(
        Array.from({ length: totalFloors }, (_, i) => i + 1).reduce(
            (acc, floor) => ({
                ...acc,
                [floor]: { up: false, down: false }
            }),
            {}
        )
    );

    const handleButtonPress = (floor: number, direction: Direction) => {
        if (direction)
            setFloorButtons((prevState) => ({
                ...prevState,
                [floor]: {
                    ...prevState[floor],
                    [direction]: true
                }
            }));
    };

    useEffect(() => {
        if (targetFloor && currentFloor && targetFloor === currentFloor) {
            setTimeout(() => {
                setFloorButtons((prevState) => ({
                    ...prevState,
                    [targetFloor]: {
                        up: false,
                        down: false
                    }
                }));
            }, 500);
        }
    }, [targetFloor, currentFloor]);

    return (
        <>
            {Array.from({ length: totalFloors }, (_, i) => totalFloors - i).map((floor) => (
                <Floor
                    totalFloors={totalFloors}
                    key={floor}
                    floorNumber={floor}
                    currentFloor={currentFloor}
                    moveElevator={moveElevator}
                    height={TOTAL_FLOOR_HEIGHT}
                    direction={direction}
                    isDownPressed={floorButtons[floor].down}
                    isUpPressed={floorButtons[floor].up}
                    handleButtonPress={handleButtonPress}
                />
            ))}
        </>
    );
};

export default Building;

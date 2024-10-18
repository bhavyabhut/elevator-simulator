import ElevatorDoors from '../Door';

const ElevatorBox = ({ doorOpen }: { doorOpen: boolean }) => {
    return (
        <div className="relative w-full h-full bg-blue-500 rounded-lg shadow-lg flex justify-center items-center">
            <ElevatorDoors doorOpen={doorOpen} />
        </div>
    );
};

export default ElevatorBox;

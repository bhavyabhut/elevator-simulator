import axios from 'axios';
import { Elevator } from '../types';

export const fetchElevatorStateAPI = async (): Promise<Elevator | undefined> => {
    try {
        return (await axios.get('http://localhost:3001/api/elevator/state')).data;
    } catch (error) {
        console.error('Error fetching elevator state:', error);
    }
};

export const postElevatorCallAPI = async (floor: number): Promise<Elevator | undefined> => {
    try {
        return (await axios.post('http://localhost:3001/api/elevator/call', { floor })).data;
    } catch (error) {
        console.error('Error calling elevator update :', error);
    }
};

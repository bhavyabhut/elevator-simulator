import axios, { AxiosResponse } from 'axios';
import { Elevator } from '../types';

export const fetchElevatorStateAPI = async (): Promise<AxiosResponse<Elevator> | undefined> => {
    try {
        return await axios.get('http://localhost:3001/api/elevator/state');
    } catch (error) {
        console.error('Error fetching elevator state:', error);
    }
};

export const postElevatorCallAPI = async (
    floor: number
): Promise<AxiosResponse<{ elevator: Elevator }> | undefined> => {
    try {
        return await axios.post('http://localhost:3001/api/elevator/call', { floor });
    } catch (error) {
        console.error('Error calling elevator update :', error);
    }
};

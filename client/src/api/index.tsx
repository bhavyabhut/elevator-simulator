import axios from 'axios';
import { Elevator } from '../types';
import { API_BASE_URL } from '../config';

export const fetchElevatorStateAPI = async (): Promise<Elevator | undefined> => {
    try {
        return (await axios.get(`${API_BASE_URL}/state`)).data;
    } catch (error) {
        console.error('Error fetching elevator state:', error);
    }
};

export const postElevatorCallAPI = async (floor: number): Promise<Elevator | undefined> => {
    try {
        return (await axios.post(`${API_BASE_URL}/call`, { floor })).data;
    } catch (error) {
        console.error('Error calling elevator update:', error);
    }
};

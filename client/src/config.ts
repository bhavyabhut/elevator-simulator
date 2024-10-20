const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProduction
    ? 'https://elevator-simulator-server.onrender.com/api/elevator'
    : 'http://localhost:3001/api/elevator';

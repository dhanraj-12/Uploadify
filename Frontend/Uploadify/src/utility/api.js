import axios from 'axios';
import config from '../../config';

const API = config.url;
const api = axios.create({
    baseURL: `${API}/auth/`,
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);
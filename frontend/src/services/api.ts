import axios from 'axios';

import { setupInterceptors } from './interceptors';

export const api = setupInterceptors(axios.create({
  baseURL: import.meta.env.VITE_API_URL
}));

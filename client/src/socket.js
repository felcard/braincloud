import { io } from 'socket.io-client';

// `npm run dev` points this at the local server (see .env.development).
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://braincloud-fel.koyeb.app';

// One connection shared by every page.
export const socket = io(SERVER_URL);

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
//const io = new Server(server);

const { PORT = 8000 } = process.env;

//const io = socketIo(server);
module.exports = new Server(server, {
    cors: {
        origin: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


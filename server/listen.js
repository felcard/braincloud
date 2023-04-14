const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');

const appServer = express();
appServer.use(cors());
const { PORT = 3001 } = process.env;
const socketServer = appServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//const io = socketIo(server);
module.exports = socketIo(socketServer, {
    //cors: true//simplified version of below
    cors: {
        origin: "*",
        // methods: ["GET", "POST"],
        // credentials: true //this is for sending cookies and other credentials
    }
});

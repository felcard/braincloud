const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//const io = socketIo(server);
module.exports = socketIo(server, {
    cors: true//simplified version of below
    // cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"],
    //     credentials: true //this is for sending cookies and other credentials
    // }
});

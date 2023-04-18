const express = require('express');
const http = require('http');
//const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
//const io = new Server(server);

const { PORT = 8000 } = process.env;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

//const io = socketIo(server);
module.exports = new Server(server, {
    cors: {
        origin: ["https://beautiful-tarsier-8e762a.netlify.app",
            "http://86.168.156.152:3000"],
        allowedHeaders: ["Authorization"], credentials: true
    }
}
    //     {
    //     cors: {
    //         origin: true,
    //         allowedHeaders: ['Content-Type', 'Authorization']
    //     }
    // }
);




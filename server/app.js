const express = require('express');
const http = require('http');
//const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
//const io = new Server(server);
const { wordsSpace } = require('./spaces/namespaces');



//const io = socketIo(server);
io = new Server(server, {
    cors: {
        origin: "*",
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


//const { adminAuth, usersAuth } = require('./spaces/middleware');


//////////////////NameSpace declaration//////////////////////
// const loginIo = io.of('/login');
// const adminIo = io.of('/admin');
// const sessionIo = io.of('/session');

////////////////////Middleware////////////////////////////
// adminIo.use(adminAuth);
// io.use(usersAuth);

// io is the main space ('/' path or route in the browser) so all other namespaces are created through it.


////////////////Namespace Endpoints///////////////////////
// adminIo.on('connection', adminSpace);
// loginIo.on('connection', loginSpace);
// sessionIo.on('connection', sessionLoginSpace);
io.on('connection', wordsSpace);

const { PORT = 8000 } = process.env;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//create http/socket.io server
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer();

//listen port setup before exporting module
const { PORT = 8000 } = process.env;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//export socket.io server instance
module.exports = new Server(server, {
    cors: {
        origin: "https://braincloud.netlify.app/",

        allowedHeaders: "Authorization", credentials: true
    }
});

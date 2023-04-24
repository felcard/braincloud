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
        //below we allow only auth headers and credentials since we are storing
        //the token as a cookie in the client
        allowedHeaders: "Authorization", credentials: true
    }
});

//this info is for namespaces section not the listen file
//is safer to send the token in the header since it is more secure:
//socket.emit('token', { data: myData }, { Authorization: `Bearer ${token}` }); //note bearer is standard for sending tokens to the client
//and in the client the token is extracted: socket.on('myMessage', (data, header) => {
// Extract token from Authorization header
//const token = header.Authorization.split(' ')[1];
//the client will send the token in the header for the initial handshake
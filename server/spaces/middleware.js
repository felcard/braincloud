const jwt = require("jsonwebtoken");
require('dotenv').config({
    path: `${__dirname}/../auth.env`
});

////////////////////ADMIN  MIDDLEWARE//////////////////////if admin does not provide valid token then it needs to /login
exports.adminAuth = async (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token, 'line 9 middleware');
    if (!token) {
        return next(new Error('Token unavailable'));
    }
    try {
        const decodedToken = await jwt.verify(token, process.env.jwt);
        console.log(decodedToken, 'adminIo');
        next();
    } catch (err) {
        return next(new Error("invalid/expired token"));
    }
};

////////////////////USER  MIDDLEWARE//////////////////////if user does not provide valid token then it needs to add code in session page
exports.usersAuth = async (socket, next) => {
    //this middleware handles handshake on /board route. When client connects, if there is no token it sends a message and stop the socket's events from running.
    const token = socket.handshake.auth.token;//this happens once on connection
    if (!token) {
        return next(new Error('Token unavailable'));
    }
    try {//If the token is expired or invalid, calling jwt.verify() will throw an error. Therefore, decodedToken will not be defined in such cases. To handle the error, wrap the call to jwt.verify() in a try-catch block and handle the error accordingly.
        const decodedToken = await jwt.verify(token, process.env.jwt);
        console.log(decodedToken, 'ioMiddleware');
        next();
    } catch (err) {
        return next(new Error("invalid/expired token"));
    }
};
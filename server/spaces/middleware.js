const jwt = require("jsonwebtoken");

require('dotenv').config({
    path: `${__dirname}/../auth.env`
});
//adminAuth controls admin validates admin user token
exports.adminAuth = async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Token unavailable'));
    }
    try {
        await jwt.verify(token, process.env.jwt);
        next();
    } catch (err) {
        return next(new Error("invalid/expired token"));
    }
};
//usersAuth validates user session token
exports.usersAuth = async (socket, next) => {
    const token = socket.handshake.auth.token;//this happens once on connection
    if (!token) {
        return next(new Error('Token unavailable'));
    }
    try {//if token invalid or expired jwt generates an error that the catch function detects
        await jwt.verify(token, process.env.jwt);
        next();
    } catch (err) {
        return next(new Error("invalid/expired token"));
    }
};
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const { Word, User } = require('./db/schemas');
require('./db/connection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

require('dotenv').config({
    path: `${__dirname}/auth.env`
});

// Create Express app and Socket.IO server
const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//const io = socketIo(server);
const io = socketIo(server, {
    cors: true//simplified version of below
    // cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"],
    //     credentials: true //this is for sending cookies and other credentials
    // }
});

const loginIo = io.of('/login');

loginIo.on('connection', socket => {
    console.log('client connected to ADMIN login site');
    // Handle new word submissions from client
    socket.on('login', async (details) => {
        const { username } = details;
        const user = await User.find({ username }).then(res => res[0]);
        if (!user) {
            socket.emit('token', 'invalid-user');
        } else {
            const valid = await bcrypt.compare(details.password, user.password);
            if (!valid) {
                socket.emit('token', 'invalid-password');
                // return Promise.reject({
                //     status: 400,
                //     msg: "invalid password"
                // });
            } else {
                const token = jwt.sign(
                    {
                        userId: username,
                    },
                    process.env.jwt,

                    { expiresIn: "24h" }
                );
                socket.emit('token', token);
            }
        }

    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A new client connected');
    // Send all words to the client on connection
    Word.find().then(words => {
        socket.emit('initialWords', words);
    });
    // Handle new word submissions from client
    socket.on('addWord', (text) => {
        console.log(`Adding word: ${text}`);
        Word.findOneAndUpdate({ text }, { $inc: { count: 1 } }, { upsert: true, new: true }).then(inserted => {
            console.log(inserted);
            if (inserted.count === 1) io.emit('newWord', inserted);
        });
        // Word.insertMany({ text }).then(inserted => {
        //     io.emit('newWord', inserted);
        // });
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

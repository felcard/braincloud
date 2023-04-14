const io = require('./listen');
const { Word, User, Code } = require('./db/schemas');
require('./db/connection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

require('dotenv').config({
    path: `${__dirname}/auth.env`
});

const loginIo = io.of('/login');
const adminIo = io.of('/admin');
const sessionIo = io.of('/session');
////////////////////ADMIN  MIDDLEWARE//////////////////////if admin does not provide valid token then it needs to /login
adminIo.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
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
});

adminIo.on('connection', async socket => {
    console.log('client connected to ADMIN site');
    //on connection we send the current code stored in the db
    const setCode = await Code.find({ id: 'codigo' });
    socket.emit('msg', setCode[0].session);
    socket.on('msg', async hour => {
        const crypto = require('crypto');
        const random = crypto.randomBytes(3).toString('hex');
        await Code.deleteMany();
        await Code.insertMany({ session: random, duration: hour });
        socket.emit('msg', random);
    });
    socket.on('delete', async () => {
        const deletedFeedback = await Word.deleteMany();
        socket.emit('delete', deletedFeedback.acknowledged);
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected from admin site');
    });
});

loginIo.on('connection', socket => {
    console.log('client connected to LOGIN');
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
        console.log('A client disconnected from login site');
    });
});


io.use(async (socket, next) => {
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
});

sessionIo.on('connection', socket => {
    console.log('client connected to SESSION');
    socket.on('newCode', async code => {
        const setCode = await Code.find({ id: 'codigo' });
        if (setCode[0].session === code) {
            const token = jwt.sign(
                { sessionId: code }, process.env.jwt, { expiresIn: setCode[0].duration }
            );
            socket.emit('sessionToken', token);
        }
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected from session site');
    });
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('client connected to BOARD');
    // Send all words to the client on connection

    Word.find().then(words => {
        socket.emit('initialWords', words);
    });
    // Handle new word submissions from client
    socket.on('addWord', (text) => {
        console.log(`Adding word: ${text}`);
        Word.findOneAndUpdate({ text }, { $inc: { count: 1 } }, { upsert: true, new: true }).then(async inserted => {
            console.log(inserted);
            const allWords = await Word.find();
            socket.emit('initialWords', allWords);
            //if (inserted.count === 1) io.emit('newWord', inserted);
        });
        // Word.insertMany({ text }).then(inserted => {
        //     io.emit('newWord', inserted);
        // });
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected from BOARD site');
    });
});
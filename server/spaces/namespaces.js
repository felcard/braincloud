const { Word, User, Code } = require('../db/schemas');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

require('../db/connection');
require('dotenv').config({
    path: `${__dirname}/../auth.env`
});


exports.wordsSpace = (socket, io) => {
    console.log('client connected to BOARD');
    // Send all words to the client on connection
    Word.find().then(words => {
        socket.emit('initialWords', words);
    });
    // Handle new word submissions from client
    socket.on('addWord', async (text) => {
        console.log(`Adding word: ${text}`);
        //find word and insert if unexistent, increase its count property
        await Word.findOneAndUpdate({ text },
            { $inc: { count: 1 } }, { upsert: true, new: true }
        );
        //after inserting retrieve all words and send back to client
        const allWords = await Word.find();
        io.emit('initialWords', allWords);
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected from BOARD site');
    });
};

exports.sessionLoginSpace = (socket) => {
    console.log('client connected to SESSION');
    socket.on('newCode', async code => {
        const setCode = await Code.find({ id: 'codigo' });
        //check if client's code equals stored code and ends a new token back if it is
        if (setCode[0].session === code) {
            //create a new token is sent back to client for the handshake exchange 
            //handled by the auth middleware
            const token = jwt.sign(
                { sessionId: code }, process.env.jwt, { expiresIn: setCode[0].duration }
            );
            socket.emit('sessionToken', token);
        }
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected from session site');
    });
};

exports.adminSpace = async (socket, io) => {
    console.log('client connected to ADMIN site');
    //on connection we send the current code stored in the db for the admin to see
    const setCode = await Code.find({ id: 'codigo' });
    socket.emit('msg', setCode[0].session);
    socket.on('msg', async hour => {
        const crypto = require('crypto');
        //create a new code of six random characters
        const random = crypto.randomBytes(3).toString('hex');
        //delete current code
        await Code.deleteMany();
        //new code is created with the time duration (hour) and stored in db
        await Code.insertMany({ session: random, duration: hour });
        socket.emit('msg', random);
    });
    socket.on('delete', async () => {
        const deletedWords = await Word.deleteMany();
        socket.emit('delete', deletedWords.acknowledged);
        //send empty array to trigger initialWords on other users to clear
        //their screens of deleted words
        io.emit('initialWords', []);
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected from admin site');
    });
};

exports.loginSpace = socket => {
    console.log('client connected to LOGIN');
    socket.on('login', async (details) => {
        //extract username from details sent by admin in login
        const { username } = details;
        //find user in the db
        const user = await User.find({ username }).then(res => res[0]);
        if (!user) {
            socket.emit('token', 'invalid-user');
        } else {
            //compare password sent by admin with the genuine stored password
            const valid = await bcrypt.compare(details.password, user.password);
            if (!valid) {
                socket.emit('token', 'invalid-password');
            } else {
                //create new token for admin handshake with 24hour duration 
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
};
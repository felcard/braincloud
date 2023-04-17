const { Word, User, Code } = require('../db/schemas');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('../db/connection');
require('dotenv').config({
    path: `${__dirname}/../auth.env`
});


exports.wordsSpace = socket => {
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
};

exports.sessionLoginSpace = socket => {
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
};

exports.adminSpace = async socket => {
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
};

exports.loginSpace = socket => {
    console.log('client connected to LOGIN');
    // Handle new word submissions from client
    socket.on('login', async (details) => {
        console.log(details, '78 namespaces');
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
};
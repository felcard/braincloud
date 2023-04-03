const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config({
    path: `${__dirname}/prod.env`
});
if (!process.env.ATLAS_URI) {
    throw new Error('ATLAS_URI not set');
}

const mongoPath = process.env.ATLAS_URI;
// Connect to MongoDB database
mongoose.connect(mongoPath, {
    useNewUrlParser: true, useUnifiedTopology: true,
});

// Define Word model(mongoDB schema)
const Word = mongoose.model('word', {
    text: { type: String },
    count: { type: Number, default: 0 }
});
//mongoose.connection.syncIndexes();

// Create Express app and Socket.IO server
const app = express();
app.use(cors());
const server = app.listen(3001, () => {
    console.log('Server listening on port 3000');
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

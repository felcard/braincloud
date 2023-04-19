const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// const cors = require('cors');
// app.use(cors());


/////////////Mongoose
// const mongoose = require('mongoose');
// require('dotenv').config({
//     path: `${__dirname}/prod.env`
// });
// if (!process.env.ATLAS_URI) {
//     throw new Error('ATLAS_URI not set');
// }
// const mongoPath = process.env.ATLAS_URI;
// module.exports = mongoose.connect(mongoPath, {
//     useNewUrlParser: true, useUnifiedTopology: true,
// });

// const Word = mongoose.model('word', {
//     text: { type: String, unique: true },
//     count: { type: Number, default: 0 }
// });
///////////////////////////////////


io = new Server(server, {
    cors: {
        origin: "*",
        //allowedHeaders: ["Authorization"], credentials: true
    }
});


io.on('connection', socket => {
    console.log('client connected to BOARD');
    // Send all words to the client on connection
    socket.emit('initialWords', ['fill the array']);
    // Word.find().then(words => {
    //     socket.emit('initialWords', 'hola');
    // });
    // Handle new word submissions from client
    socket.on('addWord', (text) => {
        console.log(`Adding word: ${text}`);
        socket.emit('initialWords', text);
        // Word.findOneAndUpdate({ text }, { $inc: { count: 1 } }, { upsert: true, new: true }).then(async inserted => {
        //     console.log(inserted);
        //     const allWords = await Word.find();
        //     socket.emit('initialWords', allWords);
        // });
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected from BOARD site');
    });
});

const { PORT = 8000 } = process.env;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
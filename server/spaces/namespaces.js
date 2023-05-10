const { Word } = require('../db/schemas');
require('../db/connection');
const seed = require('../words-seed');

exports.wordsSpace = async (socket, io) => {
    console.log('client connected to BOARD');
    // Send all words to the client on connection

    await Word.deleteMany();
    await Word.insertMany(seed);
    await Word.find().then(words => {
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

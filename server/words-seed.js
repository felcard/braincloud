require('./db/connection');
const mongoose = require('mongoose');

const Word = mongoose.model('word', {
    text: { type: String, unique: true },
    count: { type: Number, default: 0 }
});

const seed = [
    { text: "+++BRAINSTORM+++", count: "1" },
    { text: "AMIGOS", count: "1" },
    { text: "A.I.", count: "8" },
    { text: "BOTANICAL", count: "1" },
    { text: "PHOTOGRAPHER", count: "1" },
    { text: "DEVELOPER", count: "1" },
    { text: "JAVASCRIPT", count: "5" },
    { text: "PYTHON", count: "1" },
    { text: "MONGODB", count: "1" },
    { text: "SOCKET.IO", count: "1" },
    { text: "JSON", count: "1" },
    { text: "TYPESCRIPT", count: "6" },
    { text: "MOUNTAINS", count: "1" },
    { text: "EARTH", count: "1" },
    { text: "PLANETS", count: "1" },
    { text: "GOTMAIL", count: "1" },
    { text: "BYE", count: "1" },
    { text: "MASTER", count: "1" },
];

Word.deleteMany().then(async () => {
    await Word.insertMany(seed);
    //mogoose connection is started in the imported connection file
    //storing the required connection in a db variable and then using
    //db to close the connection works but asyncronicity needs to be handled
    //by doing (await db).disconnect();
    mongoose.disconnect();
});
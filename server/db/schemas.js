const mongoose = require('mongoose');

//create schemas
const Word = mongoose.model('word', {
    text: { type: String, unique: true },
    count: { type: Number, default: 0 }
});

const User = mongoose.model('user', {
    username: { type: String, unique: true },
    password: { type: String }
});

const Code = mongoose.model('code', {
    id: { type: String, default: "codigo" },
    session: { type: String },
    duration: { type: String, default: "1h" }
});


module.exports = { Word, User, Code };
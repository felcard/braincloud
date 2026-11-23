const mongoose = require('mongoose');

//create schemas
const Word = mongoose.model('word', {
    text: { type: String, unique: true },
    count: { type: Number, default: 0 }
});


module.exports = { Word };
require('./db/connection');
const mongoose = require('mongoose');

const Word = mongoose.model('word', {
    text: { type: String },
    count: { type: Number, default: 0 }
});

Word.deleteMany().then(() => {
    console.log('ALL DELETED');
    mongoose.connection.close();//close this particular connection. mongoose.disconnect closes all connections.
});
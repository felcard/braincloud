const mongoose = require('mongoose');
require('dotenv').config({
    path: `${__dirname}/prod.env`
});
if (!process.env.ATLAS_URI) {
    throw new Error('ATLAS_URI not set');
}

const mongoPath = process.env.ATLAS_URI;

mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Word = mongoose.model('word', {
    text: { type: String },
    count: { type: Number, default: 0 }
});

Word.deleteMany().then(del => console.log('ALL DELETED'));
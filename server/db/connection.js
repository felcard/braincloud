const mongoose = require('mongoose');

require('dotenv').config({
    path: `${__dirname}/../prod.env`
});
if (!process.env.ATLAS_URI) {
    throw new Error('ATLAS_URI not set');
}

const mongoPath = process.env.ATLAS_URI;
// Connect to MongoDB database
module.exports = mongoose.connect(mongoPath, {
    useNewUrlParser: true, useUnifiedTopology: true,
});//this makes sure unique:true works
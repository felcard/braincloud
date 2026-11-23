const mongoose = require('mongoose');
//setup process.env to the mongodb database string
require('dotenv').config({
    path: `${__dirname}/../prod.env`
});
if (!process.env.ATLAS_URI) {
    throw new Error('ATLAS_URI not set');
}
//export mongoose connection
const mongoPath = process.env.ATLAS_URI;
module.exports = mongoose.connect(mongoPath, {
    useNewUrlParser: true, useUnifiedTopology: true,
});
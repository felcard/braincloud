const mongoose = require('mongoose');


const Word = mongoose.model('word', {
    text: { type: String, unique: true },
    count: { type: Number, default: 0 }
});

const User = mongoose.model('user', {
    username: { type: String, unique: true },
    password: { type: String }
});

//CODE below used to insert the admin user as an alternative to a REGISTER endpoint. So this essentially creates the single user that is going to admin the app and the code only needs to be executed once. This will need to be changed if a register endpoint for users were required

// const bcrypt = require('bcrypt');
// require('dotenv').config({
//     path: `${__dirname}/../password.env`
// });
// const adminPass = process.env.pass;
// (async () => {
//     const hashed = await bcrypt.hash(adminPass, 15).then(hash => hash).catch(e => {
//         return Promise.reject({
//             status: 400,
//             msg: "password could not be hashed"
//         });
//     });
//     User.insertMany({ username: '<admin-username>', password: hashed });
// })();

const Code = mongoose.model('code', {
    id: { type: String, default: "codigo" },
    session: { type: String },
    duration: { type: String, default: "1h" }
});


module.exports = { Word, User, Code };
// CODE below used to insert the admin user as an alternative to a REGISTER endpoint. So this essentially creates the single user that is going to admin the app and the code only needs to be executed once. This will need to be changed if a register endpoint for users were required
const { User } = require('./db/schemas');
const bcrypt = require('bcrypt');
const db = require('./db/connection');

require('dotenv').config({
    path: `${__dirname}/password.env`
});
const adminPass = process.env.pass;

(async () => {
    const hashed = await bcrypt.hash(adminPass, 15).then(hash => hash).catch(e => {
        return Promise.reject({
            status: 400,
            msg: "password could not be hashed"
        });
    });
    User.insertMany({ username: '<admin-username>', password: hashed }).then(res => {
        console.log(res);
        db.disconnect();
    });
})();
const io = require('./listen');
//require namespace controller/model functions (endpoints)
const { adminSpace, loginSpace, wordsSpace, sessionLoginSpace } = require('./spaces/namespaces');
//require middleware auth handlers
const { adminAuth, usersAuth } = require('./spaces/middleware');


//////////////////NameSpace declaration//////////////////////
const loginIo = io.of('/login');
const adminIo = io.of('/admin');
const sessionIo = io.of('/session');

////////////////////Middleware////////////////////////////
//assign middleware functions to namespaces with access restriction
adminIo.use(adminAuth);
io.use(usersAuth);


////////////////Namespace Endpoints///////////////////////
//assign controller to namespaces (endpoints)
adminIo.on('connection', adminSpace);
loginIo.on('connection', loginSpace);
sessionIo.on('connection', sessionLoginSpace);
io.on('connection', wordsSpace);
//note that there's main namespace io ('./') and although the other namespaces depend on io
//for connection, they work completelly independent from each other as if they were separate entities
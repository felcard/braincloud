const io = require('./listen');
//require namespace controller/model functions (endpoints)
const { adminSpace, loginSpace, wordsSpace, sessionLoginSpace } = require('./spaces/namespaces');
//require middleware auth handlers
const { adminAuth, usersAuth } = require('./spaces/middleware');
const connection = require('./db/connection');


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
// in the namespaces below we need to use the main io connection in 
// order to broadcast/emit messsages to all the users since socket is a connectionto 
//the individual client that connects to a namespace. On both adminIo and io 
// we pass the main connection instance io as a parameter that is used inside the 
// namespaces 
adminIo.on('connection', socket => adminSpace(socket, io));
loginIo.on('connection', loginSpace);
sessionIo.on('connection', sessionLoginSpace);
io.on('connection', socket => wordsSpace(socket, io));
//note that there's main namespace io ('./') and although the other namespaces depend on io
//for connection, they work completelly independent from each other as if they were separate entities
//IT'S IMPORTANT TO NOTE THAT IO REFERS TO THE ENTIRE SOCKET.IO SERVER, WHILE SOCKET REFERS TO AN INDIVIDUAL SOCKET CONNECTION. WHEN YOU USE IO.EMIT(), YOU ARE EMITTING AN EVENT TO ALL CONNECTED SOCKETS, WHEREAS WHEN YOU USE SOCKET.EMIT(), YOU ARE EMITTING AN EVENT TO ONLY THE SOCKET THAT SENT THE EVENT.
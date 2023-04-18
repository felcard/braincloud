const io = require('./listen');

const { wordsSpace } = require('./spaces/namespaces');
const { adminAuth, usersAuth } = require('./spaces/middleware');


//////////////////NameSpace declaration//////////////////////
// const loginIo = io.of('/login');
// const adminIo = io.of('/admin');
// const sessionIo = io.of('/session');

////////////////////Middleware////////////////////////////
// adminIo.use(adminAuth);
// io.use(usersAuth);

// io is the main space ('/' path or route in the browser) so all other namespaces are created through it.


////////////////Namespace Endpoints///////////////////////
// adminIo.on('connection', adminSpace);
// loginIo.on('connection', loginSpace);
// sessionIo.on('connection', sessionLoginSpace);
io.on('connection', wordsSpace);
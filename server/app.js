const io = require('./listen');

const { wordsSpace } = require('./spaces/namespaces');

io.on('connection', socket => wordsSpace(socket, io));

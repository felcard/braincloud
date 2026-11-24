const http = require('node:http');
const { Server } = require('socket.io');
const rooms = require('./rooms');
const demoWords = require('./demo-words');

const PORT = process.env.PORT || 8000;
const EMPTY_ROOM_LIFETIME = 10 * 60 * 1000; // 10 minutes
const DEMO_QUESTION = 'Which programming language do you enjoy most?';

// Plain HTTP requests (health checks, visiting the URL) get a short reply.
const httpServer = http.createServer((request, response) => {
    response.end('Braincloud server is running');
});
// Any site may connect: there are no logins or cookies to protect.
const io = new Server(httpServer, { cors: { origin: '*' } });

// Socket.IO calls a handler's last argument to answer the client; it may be missing.
function answer(reply, value) {
    if (typeof reply === 'function') reply(value);
}

function isValidVoterId(voterId) {
    return typeof voterId === 'string' && voterId.length > 0 && voterId.length <= 64;
}

// Everyone gets the same cloud, but their own number of words left.
async function sendRoomStateToEveryone(room) {
    const sockets = await io.in(room.id).fetchSockets();
    for (const socket of sockets) {
        socket.emit('roomState', rooms.roomStateFor(room, socket.data.voterId));
    }
}

io.on('connection', (socket) => {
    // The room this socket joined, if it's still open.
    const currentRoom = () => rooms.getRoom(socket.data.roomId);
    // The same room, but only if this socket is its host.
    const roomIfHost = () => (socket.data.isHost ? currentRoom() : null);

    socket.on('createRoom', (options, reply) => {
        const { question, demo } = options || {};
        const room = demo
            ? rooms.createRoom({ question: DEMO_QUESTION, startingWords: demoWords })
            : rooms.createRoom({ question });
        if (!room) return answer(reply, { error: 'Too many rooms are open right now, try again later' });

        if (demo) rooms.openVoting(room, { wordLimit: 3 });
        answer(reply, { roomId: room.id, hostKey: room.hostKey });
    });

    socket.on('joinRoom', (details, reply) => {
        const { roomId, voterId, hostKey } = details || {};
        const room = rooms.getRoom(roomId);
        if (!room) return answer(reply, { error: 'This room doesn\'t exist or has closed' });
        if (!isValidVoterId(voterId)) return answer(reply, { error: 'Missing voter id' });

        if (socket.data.roomId) socket.leave(socket.data.roomId);
        socket.join(room.id);
        socket.data = { roomId: room.id, voterId, isHost: rooms.isHost(room, hostKey) };
        rooms.markRoomInUse(room);

        answer(reply, { isHost: socket.data.isHost, room: rooms.roomStateFor(room, voterId) });
    });

    socket.on('addWord', (word, reply) => {
        const room = currentRoom();
        if (!room) return answer(reply, { error: 'This room has closed' });

        const result = rooms.addWord(room, socket.data.voterId, word);
        answer(reply, result);
        if (!result.error) sendRoomStateToEveryone(room);
    });

    // Host controls
    socket.on('openVoting', (settings) => {
        const room = roomIfHost();
        if (!room) return;
        rooms.openVoting(room, settings || {});
        sendRoomStateToEveryone(room);
    });

    socket.on('closeVoting', () => {
        const room = roomIfHost();
        if (!room) return;
        rooms.closeVoting(room);
        sendRoomStateToEveryone(room);
    });

    socket.on('resetCloud', () => {
        const room = roomIfHost();
        if (!room) return;
        rooms.resetCloud(room);
        sendRoomStateToEveryone(room);
    });

    socket.on('disconnect', () => {
        const room = currentRoom();
        const nobodyLeft = !io.sockets.adapter.rooms.has(socket.data.roomId);
        if (room && nobodyLeft) rooms.markRoomEmpty(room);
    });
});

setInterval(() => rooms.deleteRoomsEmptyFor(EMPTY_ROOM_LIFETIME), 60 * 1000);

httpServer.listen(PORT, () => {
    console.log(`Braincloud server listening on port ${PORT}`);
});

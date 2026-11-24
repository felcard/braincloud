const { test } = require('node:test');
const assert = require('node:assert');
const rooms = require('./rooms');
const { cleanWord } = require('./clean-word');

test('cleanWord tidies words and rejects unusable ones', () => {
    assert.equal(cleanWord('  machine   learning '), 'MACHINE LEARNING');
    assert.equal(cleanWord(''), null);
    assert.equal(cleanWord('x'.repeat(25)), null);
    assert.equal(cleanWord(42), null);
    assert.equal(cleanWord('pelotudo'), null);
    assert.equal(cleanWord('hola pelotudo'), null);
});

test('a new room has a short id, a secret host key and closed voting', () => {
    const room = rooms.createRoom({ question: 'Favourite fruit?' });
    assert.match(room.id, /^[a-z0-9]{6}$/);
    assert.equal(room.hostKey.length, 32);
    assert.equal(room.votingOpen, false);
    assert.equal(rooms.getRoom(room.id), room);
    assert.ok(rooms.isHost(room, room.hostKey));
    assert.ok(!rooms.isHost(room, 'wrong key'));
});

test('words are only accepted while voting is open', () => {
    const room = rooms.createRoom();
    assert.deepEqual(rooms.addWord(room, 'ana', 'apple'), { error: 'Voting is closed' });

    rooms.openVoting(room);
    assert.deepEqual(rooms.addWord(room, 'ana', 'apple'), { word: 'APPLE' });
    assert.equal(room.wordCounts.APPLE, 1);
});

test('each person gets the word limit once per round', () => {
    const room = rooms.createRoom();
    rooms.openVoting(room, { wordLimit: 3 });

    rooms.addWord(room, 'ana', 'apple');
    rooms.addWord(room, 'ana', 'pear');
    assert.equal(rooms.wordsLeftFor(room, 'ana'), 1);
    rooms.addWord(room, 'ana', 'apple');
    assert.equal(rooms.addWord(room, 'ana', 'kiwi').error, 'You have used all your words for this round');
    assert.equal(rooms.wordsLeftFor(room, 'bob'), 3);

    rooms.openVoting(room); // a new round
    assert.equal(rooms.wordsLeftFor(room, 'ana'), 3);
    assert.equal(room.wordCounts.APPLE, 2, 'the cloud is kept between rounds');
});

test('an unlimited round never runs out', () => {
    const room = rooms.createRoom();
    rooms.openVoting(room, { wordLimit: null });
    for (let i = 0; i < 20; i++) rooms.addWord(room, 'ana', 'apple');
    assert.equal(room.wordCounts.APPLE, 20);
    assert.equal(rooms.wordsLeftFor(room, 'ana'), null);
});

test('an invalid word limit is ignored', () => {
    const room = rooms.createRoom();
    rooms.openVoting(room, { wordLimit: 1000 });
    assert.equal(room.wordLimit, 1);
});

test('resetting the cloud clears words and allowances', () => {
    const room = rooms.createRoom({ startingWords: { JAVA: 3 } });
    rooms.openVoting(room);
    rooms.addWord(room, 'ana', 'go');
    rooms.resetCloud(room);
    assert.deepEqual(room.wordCounts, {});
    assert.equal(rooms.wordsLeftFor(room, 'ana'), 1);
});

test('room state shows the cloud and words left, never the host key', () => {
    const room = rooms.createRoom({ question: 'Fruit?', startingWords: { APPLE: 2 } });
    rooms.openVoting(room, { wordLimit: 3 });
    const state = rooms.roomStateFor(room, 'ana');
    assert.deepEqual(state.words, [{ text: 'APPLE', count: 2 }]);
    assert.equal(state.wordsLeft, 3);
    assert.ok(!JSON.stringify(state).includes(room.hostKey));
});

test('empty rooms are deleted after the waiting time, busy ones are kept', () => {
    const emptyRoom = rooms.createRoom();
    const busyRoom = rooms.createRoom();
    rooms.markRoomEmpty(emptyRoom);

    const elevenMinutesLater = Date.now() + 11 * 60 * 1000;
    rooms.deleteRoomsEmptyFor(10 * 60 * 1000, elevenMinutesLater);

    assert.equal(rooms.getRoom(emptyRoom.id), null);
    assert.equal(rooms.getRoom(busyRoom.id), busyRoom);
});

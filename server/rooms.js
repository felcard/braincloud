// All the rules for rooms, kept in memory. No networking here, so it's easy to test.
const crypto = require('node:crypto');
const { cleanWord } = require('./clean-word');

const MAX_ROOMS = 500;
const MAX_QUESTION_LENGTH = 120;
const MAX_DIFFERENT_WORDS = 150; // keeps the cloud readable
const WORD_LIMIT_CHOICES = [1, 3, 5, null]; // words per person per round; null means unlimited
const ROOM_ID_LETTERS = 'abcdefghjkmnpqrstuvwxyz23456789'; // no look-alikes such as l/1 or o/0

const rooms = new Map(); // roomId -> room

function makeRoomId() {
    let id;
    do {
        id = Array.from({ length: 6 }, () => ROOM_ID_LETTERS[crypto.randomInt(ROOM_ID_LETTERS.length)]).join('');
    } while (rooms.has(id));
    return id;
}

function cleanQuestion(question) {
    return typeof question === 'string' ? question.trim().slice(0, MAX_QUESTION_LENGTH) : '';
}

function createRoom({ question, startingWords = {} } = {}) {
    if (rooms.size >= MAX_ROOMS) return null;

    const room = {
        id: makeRoomId(),
        hostKey: crypto.randomBytes(16).toString('hex'),
        question: cleanQuestion(question),
        votingOpen: false,
        wordLimit: 1,
        wordCounts: { ...startingWords }, // { JAVASCRIPT: 20, ... }
        wordsSentBy: {}, // { voterId: words sent this round }
        emptySince: null,
    };
    rooms.set(room.id, room);
    return room;
}

function getRoom(roomId) {
    return rooms.get(roomId) || null;
}

function isHost(room, hostKey) {
    return typeof hostKey === 'string' && hostKey === room.hostKey;
}

// Starts a new round: everyone gets their full word allowance again.
function openVoting(room, { question, wordLimit } = {}) {
    if (question !== undefined) room.question = cleanQuestion(question);
    if (WORD_LIMIT_CHOICES.includes(wordLimit)) room.wordLimit = wordLimit;
    room.votingOpen = true;
    room.wordsSentBy = {};
}

function closeVoting(room) {
    room.votingOpen = false;
}

function resetCloud(room) {
    room.wordCounts = {};
    room.wordsSentBy = {};
}

// How many more words this person can send this round; null means unlimited.
function wordsLeftFor(room, voterId) {
    if (room.wordLimit === null) return null;
    return Math.max(0, room.wordLimit - (room.wordsSentBy[voterId] || 0));
}

// Returns { word } when the word was added, or { error } explaining why not.
function addWord(room, voterId, typedWord) {
    if (!room.votingOpen) return { error: 'Voting is closed' };

    const word = cleanWord(typedWord);
    if (!word) return { error: 'That word can\'t be used' };

    if (wordsLeftFor(room, voterId) === 0) return { error: 'You have used all your words for this round' };

    const isNewWord = !(word in room.wordCounts);
    if (isNewWord && Object.keys(room.wordCounts).length >= MAX_DIFFERENT_WORDS) {
        return { error: 'The cloud is full' };
    }

    room.wordCounts[word] = (room.wordCounts[word] || 0) + 1;
    room.wordsSentBy[voterId] = (room.wordsSentBy[voterId] || 0) + 1;
    return { word };
}

// What a person in the room gets to see (never includes the host key).
function roomStateFor(room, voterId) {
    return {
        id: room.id,
        question: room.question,
        votingOpen: room.votingOpen,
        wordLimit: room.wordLimit,
        wordsLeft: wordsLeftFor(room, voterId),
        words: Object.entries(room.wordCounts).map(([text, count]) => ({ text, count })),
    };
}

function markRoomEmpty(room) {
    room.emptySince = Date.now();
}

function markRoomInUse(room) {
    room.emptySince = null;
}

// Rooms close once nobody has been in them for a while (so a host can refresh safely).
function deleteRoomsEmptyFor(milliseconds, now = Date.now()) {
    for (const room of rooms.values()) {
        if (room.emptySince !== null && now - room.emptySince >= milliseconds) {
            rooms.delete(room.id);
        }
    }
}

module.exports = {
    WORD_LIMIT_CHOICES,
    createRoom,
    getRoom,
    isHost,
    openVoting,
    closeVoting,
    resetCloud,
    wordsLeftFor,
    addWord,
    roomStateFor,
    markRoomEmpty,
    markRoomInUse,
    deleteRoomsEmptyFor,
};

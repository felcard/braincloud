const badWords = require('./bad-words');

const MAX_WORD_LENGTH = 24;

// Turns what someone typed into the word shown in the cloud,
// or returns null if it can't be used (empty, too long or not allowed).
function cleanWord(typed) {
    if (typeof typed !== 'string') return null;

    const word = typed.trim().replace(/\s+/g, ' ').toUpperCase();
    if (word === '' || word.length > MAX_WORD_LENGTH) return null;

    const lowerCase = word.toLowerCase();
    const hasBadWord = badWords.has(lowerCase) || lowerCase.split(' ').some((part) => badWords.has(part));
    if (hasBadWord) return null;

    return word;
}

module.exports = { cleanWord, MAX_WORD_LENGTH };

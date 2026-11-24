import { useState } from 'react';
import { socket } from '../socket';

function describeWordsLeft(wordsLeft) {
  if (wordsLeft === null) return 'Send as many words as you like';
  if (wordsLeft === 1) return '1 word left';
  return `${wordsLeft} words left`;
}

// The box where everyone (host included) sends their words.
export default function WordForm({ room }) {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  if (!room.votingOpen) {
    return <p className="muted">Waiting for the host to open voting…</p>;
  }

  const outOfWords = room.wordsLeft === 0;

  const sendWord = (event) => {
    event.preventDefault();
    if (word.trim() === '') return;

    setError('');
    socket.emit('addWord', word, (reply) => {
      if (reply.error) return setError(reply.error);
      setWord('');
    });
  };

  return (
    <form className="word-form" onSubmit={sendWord}>
      <input
        value={word}
        onChange={(event) => setWord(event.target.value.toUpperCase())}
        placeholder={outOfWords ? 'Wait for the next round' : 'Type a word'}
        maxLength={24}
        disabled={outOfWords}
        aria-label="Your word"
        autoFocus
      />
      <button type="submit" disabled={outOfWords}>Send</button>
      <span className="muted">{describeWordsLeft(room.wordsLeft)}</span>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

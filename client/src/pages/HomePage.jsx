import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { socket } from '../socket';
import { saveHostKey } from '../browser-storage';

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Asks the server for a new room, remembers we're its host, then opens it.
  const createRoom = (options) => {
    setError('');
    socket.emit('createRoom', options, (reply) => {
      if (reply.error) return setError(reply.error);
      saveHostKey(reply.roomId, reply.hostKey);
      navigate(`/room/${reply.roomId}`);
    });
  };

  const handleCreateRoom = (event) => {
    event.preventDefault();
    createRoom({ question });
  };

  return (
    <main className="home">
      <Title />
      <p>Ask a question, share the link, and watch everyone's answers grow into a cloud.</p>

      <form className="create-room-form" onSubmit={handleCreateRoom}>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Your question (optional)"
          maxLength={120}
          aria-label="Question for the room"
        />
        <button type="submit">Create room</button>
      </form>

      <button onClick={() => createRoom({ demo: true })}>Try a demo</button>

      {error && <p className="error">{error}</p>}
      <p className="muted">No sign-up. Rooms close 10 minutes after everyone leaves.</p>
    </main>
  );
}

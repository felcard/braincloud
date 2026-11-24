import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Title from '../components/Title';
import HostPanel from '../components/HostPanel';
import WordForm from '../components/WordForm';
import WordCloud from '../components/WordCloud';
import { socket } from '../socket';
import { getHostKey, getVoterId } from '../browser-storage';

export default function RoomPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null); // what the server says about the room
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');
  const [wordJustSent, setWordJustSent] = useState(null); // glows in the cloud for a moment
  const glowTimer = useRef(null);

  const showWordJustSent = (word) => {
    clearTimeout(glowTimer.current);
    setWordJustSent(null); // switching the glow off first lets it restart for the same word
    glowTimer.current = setTimeout(() => {
      setWordJustSent(word);
      glowTimer.current = setTimeout(() => setWordJustSent(null), 2000);
    }, 50);
  };

  useEffect(() => {
    const joinRoom = () => {
      const details = { roomId, voterId: getVoterId(), hostKey: getHostKey(roomId) };
      socket.emit('joinRoom', details, (reply) => {
        if (reply.error) return setError(reply.error);
        setRoom(reply.room);
        setIsHost(reply.isHost);
      });
    };

    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom); // first connection, or reconnecting after a drop
    socket.on('roomState', setRoom);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('roomState', setRoom);
    };
  }, [roomId]);

  if (error) {
    return (
      <main className="home">
        <Title />
        <p className="error">{error}</p>
        <Link to="/">Create a new room</Link>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="home">
        <p className="muted">Joining room…</p>
      </main>
    );
  }

  return (
    <main className="room">
      <Title small />
      {room.question && <h2 className="question">{room.question}</h2>}
      {isHost && <HostPanel room={room} />}
      <WordForm room={room} onWordSent={showWordJustSent} />
      <WordCloud words={room.words} highlightedWord={wordJustSent} />
    </main>
  );
}

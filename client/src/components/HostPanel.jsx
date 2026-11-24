import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { socket } from '../socket';

const WORD_LIMIT_OPTIONS = [
  { label: '1 word each', value: 1 },
  { label: '3 words each', value: 3 },
  { label: '5 words each', value: 5 },
  { label: 'Unlimited words', value: null },
];

// Controls only the host sees: share the room, run voting rounds, reset the cloud.
export default function HostPanel({ room }) {
  const [question, setQuestion] = useState(room.question);
  const [wordLimit, setWordLimit] = useState(room.wordLimit);
  const [showQrCode, setShowQrCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/r/${room.id}`;

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Opening voting starts a new round: everyone gets their full allowance again.
  const openVoting = () => socket.emit('openVoting', { question, wordLimit });
  const closeVoting = () => socket.emit('closeVoting');

  const resetCloud = () => {
    if (window.confirm('Remove every word from the cloud?')) socket.emit('resetCloud');
  };

  return (
    <section className="host-panel" aria-label="Host controls">
      <div className="share-link">
        <span className="muted">Share:</span>
        <a href={shareLink}>{shareLink}</a>
        <button onClick={copyShareLink}>{copied ? 'Copied!' : 'Copy link'}</button>
        <button onClick={() => setShowQrCode(!showQrCode)}>{showQrCode ? 'Hide QR' : 'QR code'}</button>
      </div>

      {showQrCode && (
        <div className="qr-code">
          <QRCodeSVG value={shareLink} size={200} />
        </div>
      )}

      <input
        className="question-input"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Question for this round"
        maxLength={120}
        disabled={room.votingOpen}
        aria-label="Question for this round"
      />

      <select
        value={String(wordLimit)}
        onChange={(event) => setWordLimit(event.target.value === 'null' ? null : Number(event.target.value))}
        disabled={room.votingOpen}
        aria-label="Words per person"
      >
        {WORD_LIMIT_OPTIONS.map((option) => (
          <option key={option.label} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>

      {room.votingOpen ? (
        <button onClick={closeVoting}>Close voting</button>
      ) : (
        <button onClick={openVoting}>Open voting</button>
      )}
      <button onClick={resetCloud}>Reset cloud</button>
    </section>
  );
}

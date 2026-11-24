// Things this browser remembers between visits.

const VOTER_ID_KEY = 'braincloud-voter-id';
const hostKeyName = (roomId) => `braincloud-host-key-${roomId}`;

// An anonymous id, so the server can count each person's words without a name or login.
export function getVoterId() {
  let voterId = localStorage.getItem(VOTER_ID_KEY);
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem(VOTER_ID_KEY, voterId);
  }
  return voterId;
}

// The secret that proves this browser created the room.
export function saveHostKey(roomId, hostKey) {
  localStorage.setItem(hostKeyName(roomId), hostKey);
}

export function getHostKey(roomId) {
  return localStorage.getItem(hostKeyName(roomId));
}

// Each word always gets the same colour, font and tilt, so the cloud doesn't
// change look every time someone votes.

export const CLOUD_FONTS = ['Rancho', 'Lakki Reddy', 'Righteous', 'Space Mono'];

// Turns a word into a stable number (the same word always gives the same number).
function numberFromWord(word) {
  let number = 0;
  for (const letter of word) {
    number = (number * 31 + letter.charCodeAt(0)) >>> 0;
  }
  return number;
}

export function colorForWord(word) {
  const hue = numberFromWord(word) % 360;
  return `hsl(${hue}, 100%, 60%)`;
}

export function fontForWord(word) {
  return CLOUD_FONTS[numberFromWord(word) % CLOUD_FONTS.length];
}

export function tiltForWord(word) {
  return numberFromWord(word) % 2 === 0 ? 3 : -3; // degrees
}

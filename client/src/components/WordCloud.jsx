import { useEffect, useRef, useState } from 'react';
import cloud from 'd3-cloud';
import { CLOUD_FONTS, colorForWord, fontForWord, tiltForWord } from '../word-style';

const SMALLEST_FONT_SIZE = 14;

// A random-number generator that gives the same numbers every time,
// so the same words are always laid out in the same places.
function repeatableRandom() {
  let seed = 42;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

// Bigger counts get bigger words, growing more slowly as counts rise.
function fontSizeFor(count, biggestCount, biggestFontSize) {
  const share = Math.log(count + 1) / Math.log(biggestCount + 1);
  return SMALLEST_FONT_SIZE + share * (biggestFontSize - SMALLEST_FONT_SIZE);
}

// Works out where each word goes. d3-cloud leaves out words that don't fit,
// so if any are missing we shrink everything a little and try again.
function layOutWords(words, width, height, onDone) {
  const biggestCount = Math.max(...words.map((word) => word.count));
  let biggestFontSize = Math.min(width, height) / 5;

  const tryLayout = () => {
    cloud()
      .size([width, height])
      .words(
        words.map((word) => ({
          text: word.text,
          size: fontSizeFor(word.count, biggestCount, biggestFontSize),
          font: fontForWord(word.text),
          rotate: tiltForWord(word.text),
          color: colorForWord(word.text),
        }))
      )
      .font((word) => word.font)
      .fontSize((word) => word.size)
      .rotate((word) => word.rotate)
      .padding(4)
      .random(repeatableRandom())
      .on('end', (placedWords) => {
        const someWordsDidNotFit = placedWords.length < words.length;
        if (someWordsDidNotFit && biggestFontSize > SMALLEST_FONT_SIZE * 1.5) {
          biggestFontSize *= 0.85;
          tryLayout();
        } else {
          onDone(placedWords);
        }
      })
      .start();
  };

  tryLayout();
}

export default function WordCloud({ words }) {
  const boxRef = useRef(null);
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  const [fontsReady, setFontsReady] = useState(false);
  const [placedWords, setPlacedWords] = useState([]);

  // Words must be measured in their real fonts, so wait until those have loaded.
  useEffect(() => {
    Promise.all(CLOUD_FONTS.map((font) => document.fonts.load(`20px "${font}"`))).then(() => setFontsReady(true));
  }, []);

  // Keep track of the space the cloud can use.
  useEffect(() => {
    const measureBox = () => {
      const { width, height } = boxRef.current.getBoundingClientRect();
      setBoxSize({ width: Math.floor(width), height: Math.floor(height) });
    };
    measureBox();
    window.addEventListener('resize', measureBox);
    return () => window.removeEventListener('resize', measureBox);
  }, []);

  useEffect(() => {
    if (!fontsReady || boxSize.width === 0 || words.length === 0) {
      setPlacedWords([]);
      return;
    }
    // Ignore a layout that finishes after newer words have arrived.
    let isOutdated = false;
    layOutWords(words, boxSize.width, boxSize.height, (newPlacedWords) => {
      if (!isOutdated) setPlacedWords(newPlacedWords);
    });
    return () => {
      isOutdated = true;
    };
  }, [words, boxSize, fontsReady]);

  return (
    <div className="word-cloud" ref={boxRef}>
      <svg width={boxSize.width} height={boxSize.height} aria-label="Word cloud">
        <g transform={`translate(${boxSize.width / 2}, ${boxSize.height / 2})`}>
          {placedWords.map((word) => (
            <text
              key={word.text}
              textAnchor="middle"
              style={{
                transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotate}deg)`,
                fontFamily: word.font,
                fontSize: word.size,
                fill: word.color,
              }}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

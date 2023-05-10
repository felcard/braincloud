import React, { useState, useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
//import Cookies from "universal-cookie";
import Cloud from "./Cloud";

import link from "./path";
//const cookies = new Cookies();
//instantiate socket and config connection via ling and using transport specified
const socket = io(link, {
  transports: ["websocket", "xhr-polling"],
});

export default function Board() {
  //const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [light, setLight] = useState(false);
  const headRef = useRef(null);

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message) {
        console.log(err.message);
      }
    });
    return () => socket.off("connect_error");
  }, []);

  /////////////////////////////////////////////

  // Handle new word submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newWord !== "") {
      console.log(newWord);
      socket.emit("addWord", newWord);
      setNewWord("");
    }
  };

  // Listen for initial words from server
  useEffect(() => {
    socket.on("initialWords", (words) => {
      setWords(words);
    });

    return () => {
      socket.off("initialWords");
    };
  }, [words]);

  const handleTheme = () => {
    if (light) {
      setLight(false);
      document.documentElement.style.backgroundColor = "#281b1b";
    } else {
      setLight(true);
      document.documentElement.style.backgroundColor = "rgb(172, 56, 164)";
    }
  };
  return (
    <div
      id="board"
      style={{
        background: `${light ? "rgb(172, 56, 164)" : "#281b1b"}`,
      }}
    >
      <div id="canvas-top" ref={headRef}>
        <h1
          onClick={handleTheme}
          style={{
            fontFamily: "titulo",
            cursor: "pointer",
          }}
          className="non-select"
        >
          BRAINCLOUD
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            style={{
              background: `${light ? "rgb(233, 172, 229)" : "#2e1f03"}`,
            }}
            type="text"
            value={newWord}
            onChange={(event) => setNewWord(event.target.value.toUpperCase())}
          />
        </form>
      </div>

      <div id="words">
        <Cloud words={words} headHeight={headRef.current?.offsetHeight} />
      </div>
    </div>
  );
}

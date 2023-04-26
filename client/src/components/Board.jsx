import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import Cloud from "./Cloud";

import link from "./path";
const cookies = new Cookies();
//instantiate socket and config connection via ling and using transport specified
const socket = io(link, {
  transports: ["websocket", "xhr-polling"],
});

export default function Board() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [light, setLight] = useState(false);
  const headRef = useRef(null);

  useEffect(() => {
    //retrieve cookie on render
    const cookie = cookies.get("SESSION-TOKEN");
    //set the auth token
    socket.auth = { token: cookie };
    //start socket connection. although not strictly necessary as seen on the other components that dont need auth the connect() method is not required although in this case we connect after setting the auth token since the auth middleware will not trigger otherwise--further tests required to confirm---
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message) {
        console.log(err.message);
        navigate("/session");
      } //react suggests using navigate() always inside a useEffect
      //console.log(err.message) log the error message to the console
    });
    return () => socket.off("connect_error");
  }, [navigate]);

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
            fontFamily: "Nabla",
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

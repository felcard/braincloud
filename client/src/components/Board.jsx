import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";

import link from "./path";
const cookies = new Cookies();

const socket = io(link, {
  transports: ["websocket", "xhr-polling"],
});

export default function Board() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [light, setLight] = useState(true);
  const [fontColorRotate, setFontColorRotate] = useState([]);

  const fonts = () => {
    const fontArr = [
      "Rancho",
      "Lakki Reddy",
      "Righteous",
      "Space Mono",
      "Rancho",
      "Lakki Reddy",
      "Righteous",
      "Space Mono",
    ];
    const fontInd = Math.floor(Math.random() * 7);
    return fontArr[fontInd];
  };

  useEffect(() => {
    const cookie = cookies.get("SESSION-TOKEN");
    socket.auth = { token: cookie };
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message) {
        navigate("/session");
      }
      //console.log(err.message) log the error message to the console
      // display the error message to the user using a notification or alert
    });
    return () => socket.off("connect_error");
  }, [navigate]);

  /////////////////////////////////////////////

  // Handle new word submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newWord !== "") {
      socket.emit("addWord", newWord);
      setNewWord("");
    }
  };

  // Listen for new words from server
  // useEffect(() => {
  //   socket?.on("newWord", (word) => {
  //     console.log(word);
  //     setWords((curr) => {
  //       console.log([...curr, word]);
  //       return [...curr, word];
  //     });
  //   });
  //   return () => {
  //     socket?.off("newWord");
  //   };
  // }, [socket]);
  //Including words in the dependency array of the useEffect hook above, means that the effect will be re-run every time words changes. This will create a new socket listener every time words changes, and the previous listener will be cleaned up by the return function of the previous effect.So, every time words changes, the previous listener will be removed, a new listener will be created, and the state will be updated with the new word received by the socket. If we don't include the 'words' array in the dependency array of the useEffect, the useEffect block will only run once, therefore the socket listener will be created once and the return statement remember that it clears on the second time, so this one will not run and the strange thing is the the socket listener will increase the listening instances each time a word(event) is emitted causing repeated words in the 'words' array, displaying repeated words in the page and causing the repeated key/child issue DOM problem

  // Listen for initial words from server
  useEffect(() => {
    socket.on("initialWords", (words) => {
      setWords(words);
      //create an array with random values for fontFamily, color and rotation
      const colorArr = [];
      for (let i = 0; i < words.length; i++) {
        const randColor = `hsl(${Math.floor(Math.random() * 359)}, 100%, 60%)`;
        const randRot = Math.floor(Math.random() * 10);
        const rotate = `rotate(${i % 2 === 0 ? -randRot : randRot}deg)`;
        colorArr.push([randColor, fonts(), rotate]);
      }
      setFontColorRotate(colorArr);
    });

    return () => {
      socket.off("initialWords");
    };
  }, []);

  const handleTheme = () => {
    if (light) {
      setLight(false);
      document.documentElement.style.backgroundColor = "rgb(70, 64, 69)";
    } else {
      setLight(true);
      document.documentElement.style.backgroundColor = "rgb(172, 56, 164)";
    }
  };
  console.log(document.querySelector("#words")?.offsetWidth);
  console.log(document.querySelector("#words")?.offsetHeight);
  return (
    <div
      id="board"
      style={{
        background: `${light ? "rgb(172, 56, 164)" : "rgb(70, 64, 69)"}`,
      }}
    >
      <h1
        onClick={handleTheme}
        style={{ fontFamily: "Nabla", fontSize: "5em", cursor: "pointer" }}
      >
        BRAINSTORM
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          style={{ background: `${light ? "rgb(233, 172, 229)" : "gray"}` }}
          type="text"
          value={newWord}
          onChange={(event) => setNewWord(event.target.value.toUpperCase())}
        />
        {/* <button type="submit">Add Word</button> */}
      </form>
      <div id="words">
        {words.map((word, ind) => (
          <div
            key={`${word._id}-${word.count}`}
            style={{
              fontFamily: `${fontColorRotate[ind][1]}`,
              fontSize: `${1 + 0.6 * word.count}em`,
              color: `${fontColorRotate[ind][0]}`,
              transform: `${fontColorRotate[ind][2]}`,
            }}
          >
            {word.text}
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");
function Board() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");

  // Handle new word submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newWord !== "") {
      socket.emit("addWord", newWord);
      setNewWord("");
    }
  };

  // Listen for new words from server
  useEffect(() => {
    socket.on("newWord", (word) => {
      setWords((curr) => [...curr, word]);
    });
    return () => {
      socket.off("newWord");
    };
  }, [words]);
  //Including words in the dependency array of the useEffect hook above, means that the effect will be re-run every time words changes. This will create a new socket listener every time words changes, and the previous listener will be cleaned up by the return function of the previous effect.So, every time words changes, the previous listener will be removed, a new listener will be created, and the state will be updated with the new word received by the socket. If we don't include the 'words' array in the dependency array of the useEffect, the useEffect block will only run once, therefore the socket listener will be created once and the return statement remember that it clears on the second time, so this one will not run and the strange thing is the the socket listener will increase the listening instances each time a word(event) is emitted causing repeated words in the 'words' array, displaying repeated words in the page and causing the repeated key/child issue DOM problem

  // Listen for initial words from server
  useEffect(() => {
    socket.on("initialWords", (words) => {
      setWords(words);
    });
  }, []);

  return (
    <div>
      <h1>Word List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newWord}
          onChange={(event) => setNewWord(event.target.value)}
        />
        <button type="submit">Add Word</button>
      </form>
      <div>
        {words.map((word) => (
          <div key={word._id}>{word.text}</div>
        ))}
      </div>
    </div>
  );
}

export default Board;

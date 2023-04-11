import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const socketLogin = io("http://localhost:3001/login");

export default function Login() {
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");

  // Handle new word submission
  const handleSubmit = (event) => {
    event.preventDefault();
    socketLogin.emit("login", { username: userInput, password: passInput });
    setUserInput("");
    setPassInput("");
  };

  useEffect(() => {
    socketLogin.on("token", (token) => {
      if (token === "invalid-user") {
        alert("unauthorised user");
      } else if (token === "invalid-password") {
        alert("invalid password");
      } else {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); //30days cookie
        cookies.set("TOKEN", token, { expires });
        socketLogin.disconnect();
      }
    });
    socketLogin.on("disconnect", () => {});
  }, []);

  return (
    <div id="login">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <h2>username:</h2>
        <label htmlFor="username-input">
          <input
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            id="username-input"
          />
        </label>
        <h2>password:</h2>
        <label htmlFor="password-input">
          <input
            type="password"
            value={passInput}
            onChange={(event) => setPassInput(event.target.value)}
            className="pass-input"
            id="password-input"
          />
        </label>
        <br />
        <br />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

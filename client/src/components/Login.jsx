import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import link from "./path";

const cookies = new Cookies();
const socketLogin = io(link + "login", {
  transports: ["websocket", "xhr-polling"],
});

export default function Login() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");

  // useEffect(() => {
  //   socketLogin.connect();
  //   return () => {
  //     socketLogin.disconnect();
  //   };
  // }, []);

  // Handle new word submission
  const handleSubmit = (event) => {
    event.preventDefault();
    socketLogin.emit("login", { username: userInput, password: passInput });
    setUserInput("");
    setPassInput("");
  };
  //once admin signs in above the details are checked and we get a response accordingly below
  useEffect(() => {
    socketLogin.on("token", (token) => {
      if (token === "invalid-user") {
        alert("unauthorised user");
      } else if (token === "invalid-password") {
        alert("invalid password");
      } else {
        console.log(token);
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); //30days cookie cookies with no expiration day get eliminated by the browser when the session finishes.
        cookies.set("TOKEN", token, { expires });
        navigate("/admin");
      }
    });
    return () => {
      socketLogin.off("token");
    };
  }, [navigate]);

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

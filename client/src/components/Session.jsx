import { useState, useEffect } from "react";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import link from "./path";

const cookies = new Cookies();

const socketSession = io(link + "session", {
  transports: ["websocket", "xhr-polling"],
});

export default function Session() {
  const [newCode, setNewCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    socketSession.emit("newCode", newCode);
    setNewCode("");
  };

  useEffect(() => {
    socketSession.on("sessionToken", (token) => {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); //30days cookie expiration
      cookies.set("SESSION-TOKEN", token, { expires });
      navigate("/");
    });
    return () => {
      socketSession.off("sessionToken");
      socketSession.disconnect();
    };
  }, [navigate]);

  return (
    <div id="session">
      <h1>Session</h1>
      <h2>Enter a valid code to start</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCode}
          onChange={(event) => setNewCode(event.target.value)}
        />
        <br />
        <button type="submit">Submit Code</button>
      </form>
    </div>
  );
}

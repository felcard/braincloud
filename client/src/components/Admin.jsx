import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import link from "./path";
const cookies = new Cookies();

let socketAdmin = io(link + "admin", {
  transports: ["websocket", "xhr-polling"],
});

let box = [];
box.length = 24;
const hours = box.fill("").map((a, b) => (a = b + 1 + "h"));

export default function Admin() {
  const [code, setCode] = useState("");
  const [hour, setHour] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = cookies.get("TOKEN");
    socketAdmin.auth = { token: cookie };
    socketAdmin.connect();
    return () => socketAdmin.disconnect();
  }, []);

  socketAdmin.on("connect_error", (err) => {
    if (err.message) {
      console.log("redirecting", err.message);
      navigate("/login");
    }
  });

  const handleOnClick = () => {
    //when we emit the event 'msg' it triggers a new code generetion in the server and the code is sent back and listened to below
    socketAdmin.emit("msg", hour || "1h");
  };
  const handleDelete = () => {
    socketAdmin.emit("delete");
  };

  const handleHourChange = (e) => {
    //for some reason the value of hour was not being updated in sync when using setHour() on its own.
    setHour((curr) => {
      return e.target.value;
    });
  };

  useEffect(() => {
    //handleOnCLick emits msg the will trigger the server to create and store an new code in teh database and the server will emit msg back with the code to be displayed here
    socketAdmin.on("msg", (kode) => {
      setCode(kode);
    });
    socketAdmin.on("delete", (ok) => ok && alert("words deleted"));
    return () => {
      socketAdmin.off("msg");
    };
  }, []);

  return (
    <div id="admin">
      <h1>Admin</h1>
      <br />
      <h2>CURRENT CODE</h2>
      <div style={{ fontSize: "3em", background: "goldenrod" }}>
        {code || "GOT TO /login"}
      </div>
      <br />
      <button type="button" onClick={handleOnClick}>
        GENERATE CODE
      </button>
      <br />
      <br />
      <label htmlFor="hours">Choose code duration: </label>
      <select onChange={handleHourChange} value={hour}>
        {hours.map((hour) => {
          return (
            <option value={hour} key={hour}>
              {hour}
            </option>
          );
        })}
      </select>
      <br />
      <br />
      <br />
      <button type="button" onClick={handleDelete}>
        DELETE WORDS
      </button>
    </div>
  );
}

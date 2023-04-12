import io from "socket.io-client";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const cookie = cookies.get("TOKEN");
const socketAdmin = io("http://localhost:3001/admin", {
  auth: {
    token: cookie,
  },
});
let box = [];
box.length = 24;
const hours = box.fill("").map((a, b) => (a = b + 1 + "h"));

export default function Admin() {
  const [code, setCode] = useState("");
  const [hour, setHour] = useState("");

  const handleOnClick = () => {
    //when we emit the event 'msg' it triggers a new code generetion in the server and the code is sent back and listened to below
    socketAdmin.emit("msg", hour || "1h");
  };
  const handleDelete = () => {};

  const handleHourChange = (e) => {
    //for some reason the value of hour was not being updated in sync when using setHour() on its own.
    setHour((curr) => {
      return e.target.value;
    });
  };

  useEffect(() => {
    socketAdmin.on("msg", (kode) => {
      setCode(kode);
    });
    return () => {
      socketAdmin.disconnect();
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

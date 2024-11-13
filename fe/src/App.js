import { Routes, Route, Link, useParams } from "react-router-dom";
import Main from "./pages/Main";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import { getConfig } from "./config/getConfig";
import axios from "axios";
const config = getConfig()

axios.defaults.withCredentials = true;

function App() {
  const [loggedUser, setLoggedUser] = useState(false)

  async function getLoginStatusFromCookie() {
    try {
      const loginResp = await axios.get(`${config.backend}/login/status`)
      if (loginResp.status === 200) {
        setLoggedUser(true)
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log("User isn't logged in.")
      }
    }
  }

  async function logout() {
    await axios.delete(`${config.backend}/login`)
    setLoggedUser(false)
  }


  useEffect(() => {
    getLoginStatusFromCookie()
  })


  return (
    <div className="App">
      {loggedUser && <button onClick={logout}>Log Out</button>}
      <Routes>
        {loggedUser ? <Route path="/" element={<Main loggedUser={loggedUser} />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
      </Routes>
    </div>
  );
}

export default App;

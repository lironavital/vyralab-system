import { Routes, Route, } from "react-router-dom";
import Main from "./pages/Main";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import { getConfig } from "./config/getConfig";
import axios from "axios";
import TtAct from "./pages/TtAct";
import YtAct from "./pages/YtAct";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      if (error?.response?.status !== 401) {
        console.log("User isn't logged in.")
      }
      else {
        toast.error(error.message)
      }
    }
  }

  async function logout() {
    await axios.delete(`${config.backend}/login`)
    setLoggedUser(false)
  }


  useEffect(() => {
    getLoginStatusFromCookie()
  }, [])


  return (
    <div className="App">
      {loggedUser && <button style={{ position: 'absolute', right: '0' }} onClick={logout}>Log Out</button>}
      <ToastContainer position="bottom-center" />
      <Routes>
        {loggedUser ? <Route path="/" element={<Main />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {loggedUser ? <Route path="/tt_act" element={<TtAct />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {loggedUser ? <Route path="/oauth/yt_act" element={<YtAct />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {!loggedUser && <Route path="/*" element={<Login setLoggedUser={setLoggedUser} />} />}
      </Routes>
    </div>
  );
}

export default App;

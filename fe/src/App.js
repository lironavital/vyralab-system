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
import Header from "./components/Header";
import TikTok from "./pages/TikTok";

const config = getConfig()

axios.defaults.withCredentials = true;

function App() {
  const [loggedUser, setLoggedUser] = useState(false)

  async function getLoginStatusFromCookie() {
    try {
      const loginResp = await axios.get(`${config.backend}/login/status`)
      if (loginResp.status === 200) {
        const data = localStorage.getItem('vyralab_userData')
        setLoggedUser(JSON.parse(data))
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

  useEffect(() => {
    getLoginStatusFromCookie()
  }, [])


  return (
    <div className="App">
      <ToastContainer position="bottom-center" />
      <header><Header loggedUser={loggedUser} setLoggedUser={setLoggedUser} /></header>

      <Routes>
        {loggedUser ? <Route path="/" element={<Main />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {loggedUser ? <Route path="/tiktok" element={<TikTok />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}


        {loggedUser ? <Route path="/tt_act" element={<TtAct />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {loggedUser ? <Route path="/oauth/yt_act" element={<YtAct />} /> : <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />}
        {!loggedUser && <Route path="/*" element={<Login setLoggedUser={setLoggedUser} />} />}
      </Routes>
    </div>
  );
}

export default App;

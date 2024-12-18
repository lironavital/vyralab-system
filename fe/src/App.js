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
import Sidebar from "./components/Sidebar";
import Youtube from "./pages/Youtube";
import '../src/main.css'

const config = getConfig()
axios.defaults.withCredentials = true;

const headerHeight = '60px'

function App() {
  const [loggedUser, setLoggedUser] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState('300px')

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
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'hidden', }}>
      <ToastContainer position="bottom-center" />
      <header>
        <Header loggedUser={loggedUser} setLoggedUser={setLoggedUser} headerHeight={headerHeight} />
      </header>
      <div style={{ display: 'flex', height: `calc(100vh - ${headerHeight})`, flex: '1 1 auto' }}>
        <nav>
          <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
        </nav>
        <main style={{ padding: '20px', overflowY: 'auto', marginLeft: 'auto', flex: '1 1 auto' }}>
          <Routes>
            {loggedUser ? (
              <>
                <Route path="/" element={<Main />} />
                <Route path="/tiktok" element={<TikTok />} />
                <Route path="/youtube" element={<Youtube />} />
                <Route path="/tt_act" element={<TtAct />} />
                <Route path="/oauth/yt_act" element={<YtAct />} />
              </>
            ) : (
              <Route path="/" element={<Login setLoggedUser={setLoggedUser} />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

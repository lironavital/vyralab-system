import { Routes, Route, Link, useParams } from "react-router-dom";
import Main from "./Pages/Main";
import { useState } from "react";
import Login from "./Pages/Login";

function App() {
  const [loggedUser, setLoggedUser] = useState({ logged: false, key: "" })

  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Main />} />
        {/* {loggedUser.logged ? <Route path="/hls/admin/aaa" element={<Admin loggedUser={loggedUser} />} /> : <Route path="/hls/admin/aaa" element={<Login setLoggedUser={setLoggedUser} />} />} */}
      </Routes>
    </div>
  );
}

export default App;

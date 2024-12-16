import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import ShowPopup from '../hooks/ShowPopup'
import LoginToPlatforms from './LoginToPlatforms'
const config = getConfig()

export default function Header({ loggedUser, setLoggedUser }) {
    const [showUserDropDown, setShowUserDropDown] = useState(false)
    const [showLoginToPlatforms, setShowLoginToPlatforms] = useState(false)

    async function logout() {
        await axios.delete(`${config.backend}/login`)
        setLoggedUser(false)
    }

    useEffect(() => {
        console.log(loggedUser)
    }, [])

    return (<>
        <ShowPopup isShowingState={showLoginToPlatforms} closeFunction={() => { setShowLoginToPlatforms(prev => !prev) }}>
            <LoginToPlatforms />
        </ShowPopup>
        <div style={{ display: 'flex', height: '50px', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
            <div style={{ color: 'white', fontWeight: 'bolder', marginLeft: 'auto', marginRight: "10px", cursor: 'pointer' }} onClick={() => setShowUserDropDown(prev => !prev)}>
                {loggedUser.firstName} {loggedUser.lastName}
            </div>
            {showUserDropDown && <UserDropDown logout={logout} setShowUserDropDown={setShowUserDropDown} setShowLoginToPlatforms={setShowLoginToPlatforms} />}
        </div></>
    );
}




function UserDropDown({ logout, setShowUserDropDown, setShowLoginToPlatforms }) {
    return <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', right: 0, top: '50px', backgroundColor: 'white', width: '100px', padding: 5 }} onClick={() => { setShowUserDropDown(prev => !prev) }}>
        <button style={{}} onClick={logout}>Log Out</button>
        <button style={{}} onClick={() => { setShowLoginToPlatforms((prev) => !prev) }}>Connect Platforms</button>
    </div>
}
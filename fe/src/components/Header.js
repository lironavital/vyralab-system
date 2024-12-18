import { useEffect, useState } from 'react'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import ShowPopup from '../hooks/ShowPopup'
import LoginToPlatforms from './LoginToPlatforms'
import vyralabIcon from '../images/vyralab-square.png'
const config = getConfig()

export default function Header({ loggedUser, setLoggedUser, headerHeight }) {
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
        <div style={{ display: 'flex', width: '100%', height: headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a2f33' }}>
            <a href='/'><img src={vyralabIcon} alt="icon" style={{ width: '50px', marginLeft: "50px", }}></img></a>
            <button type='button' style={{}} className='myAccount' onClick={() => setShowUserDropDown(prev => !prev)}>
                {loggedUser.firstName} {loggedUser.lastName}
            </button>
            {showUserDropDown && <UserDropDown logout={logout} setShowUserDropDown={setShowUserDropDown} setShowLoginToPlatforms={setShowLoginToPlatforms} headerHeight={headerHeight} />}
        </div></>
    );
}

function UserDropDown({ logout, setShowUserDropDown, setShowLoginToPlatforms, headerHeight }) {
    return <div className='dropDown' style={{ top: headerHeight }} onClick={() => { setShowUserDropDown(prev => !prev) }}>
        <button style={{}} onClick={() => { setShowLoginToPlatforms((prev) => !prev) }}>Connect Platforms</button>
        <button style={{}} onClick={logout}>Log Out</button>
    </div>
}
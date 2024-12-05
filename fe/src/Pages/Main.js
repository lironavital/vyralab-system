import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import LoginToPlatforms from '../components/LoginToPlatforms'
import TikTokInfo from '../components/TikTokInfo'
import YouTubeInfo from '../components/YouTubeInfo'
const config = getConfig()

export default function Main({ }) {
    const [loggedPlatforms, setLoggedPlatforms] = useState({})

    async function getLoggedPlatformsStatus() {
        const resp = await axios.get(`${config.backend}/platforms/logged`)
        setLoggedPlatforms(resp.data)
    }

    useEffect(() => {
        getLoggedPlatformsStatus()
    }, [])


    return (<div>
        <LoginToPlatforms loggedPlatforms={loggedPlatforms} setLoggedPlatforms={setLoggedPlatforms} getLoggedPlatformsStatus={getLoggedPlatformsStatus} />

        <TikTokInfo getLoggedPlatformsStatus={getLoggedPlatformsStatus} />
        <YouTubeInfo getLoggedPlatformsStatus={getLoggedPlatformsStatus} />
    </div>)
}
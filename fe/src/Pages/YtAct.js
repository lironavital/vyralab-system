import { useEffect, } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { useLocation, useNavigate } from 'react-router-dom'
const config = getConfig()

export default function YtAct() {
    const location = useLocation();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);

    async function youtube_addRefreshToken({ token }) {
        await axios.post(`${config.backend}/platforms/add`, { platform: 'youtube', resp: { yt_refresh_token: token } });
        navigate('/')
    }

    useEffect(() => {
        const yt_refresh_token = queryParams.get('code')
        youtube_addRefreshToken({ token: yt_refresh_token })
    }, [])

    return (<div>
        Please wait while you're being redirected...
    </div>)
}
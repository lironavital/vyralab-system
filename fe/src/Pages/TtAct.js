import { useEffect, } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { useLocation } from 'react-router-dom'
const config = getConfig()

export default function TtAct() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    async function tiktok_addRefreshToken({ token }) {
        await axios.post(`${config.backend}/platforms/add`, { platform: 'tiktok', resp: { tt_refresh_token: token } });
        window.location.replace('/')
    }

    useEffect(() => {
        const tt_refresh_token = queryParams.get('code')
        tiktok_addRefreshToken({ token: tt_refresh_token })
    }, [])

    return (<div>
        Please wait while you're being redirected...
    </div>)
}
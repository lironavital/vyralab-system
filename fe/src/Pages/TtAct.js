import { useEffect, } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { useLocation } from 'react-router-dom'
const config = getConfig()

export default function TtAct() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    async function tiktok_addAccessToken({ token }) {
        await axios.post(`${config.backend}/platforms/add`, { platform: 'tiktok', resp: { tt_act: token } });
        window.location.replace('/')
    }

    useEffect(() => {
        const tt_act = queryParams.get('code')
        tiktok_addAccessToken({ token: tt_act })
    }, [])

    return (<div>
        Please wait while you're being redirected...
    </div>)
}
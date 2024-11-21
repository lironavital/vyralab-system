import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
const config = getConfig()

export default function TikTokInfo({ }) {
    const [videosData, setVideosData] = useState([])

    async function getTikTokVideos() {
        const resp = await axios.get(`${config.backend}/tiktok/videos`)
        setVideosData(resp.data)
    }
    return (
        <div>
            <button onClick={getTikTokVideos}>Get TikTok Videos</button>
            {videosData.map(video => <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>{video.id}</label>
                <label>{video.title}</label>
                <img src={video.cover_image_url} style={{ width: "10%" }} alt={video.title} />
            </div>)}
        </div>
    );
}

import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
const config = getConfig()

export default function YouTubeInfo({ }) {
    const [videosData, setVideosData] = useState([])

    async function getYoutubeVideos() {
        const resp = await axios.get(`${config.backend}/youtube/videos`)
        setVideosData(resp.data)
    }
    return (
        <div style={{ marginTop: '100px' }}>
            <button onClick={getYoutubeVideos}>Get Youtube Videos</button>
            {videosData.map(video => <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>{video.id}</label>
                <label>{video.snippet.title}</label>
                <img src={video?.snippet?.thumbnails?.standard?.url} style={{ width: "10%" }} alt={video.title} />
            </div>)}
        </div>
    );
}

import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { toast } from 'react-toastify'
import SingleVideo from './SingleVideo'
import ShowPopup from '../hooks/ShowPopup'
const config = getConfig()

export default function TikTokInfo({ }) {
    const [videosData, setVideosData] = useState([])

    async function getTikTokVideos() {
        try {
            const resp = await axios.get(`${config.backend}/tiktok/videos`)
            setVideosData(resp.data)
        } catch (error) {
            if (error?.response?.data) {
                if (error.response.status === 401) {
                    toast.error(error.response.data)
                }
            }
            else {
                toast.error(error.message)
            }
        }
    }
    return (<>
        <button style={{ marginBottom: '1vh' }} onClick={getTikTokVideos}>Get TikTok Videos</button>
        <div>
            {videosData.map(video => <SingleVideo key={`video_disp_${video.video_id}`} video={video} />)}
        </div>
    </>
    );
}

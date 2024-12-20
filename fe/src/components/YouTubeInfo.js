import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { toast } from 'react-toastify'
import SingleVideo from './SingleVideo'
const config = getConfig()

export default function YouTubeInfo({ getLoggedPlatformsStatus }) {
    const [videosData, setVideosData] = useState([])
    const [generalData, setGengeneralData] = useState([])

    async function getYoutubeVideos() {
        try {
            const resp = await axios.get(`${config.backend}/youtube/videos`)
            setVideosData(resp.data)
        } catch (error) {
            if (error?.response?.data) {
                toast.error(error.response.data)
            }
            else {
                toast.error(error.message)
            }
        }
    }

    async function getGeneralData() {
        try {
            const resp = await axios.get(`${config.backend}/youtube/generalData`)
            setGengeneralData(resp.data)
        } catch (error) {
            if (error?.response?.data) {
                if (error.response.status === 401) {
                    toast.error(error.response.data)
                    getLoggedPlatformsStatus()
                }
            }
            else {
                toast.error(error.message)
            }
        }
    }


    return (
        <div style={{}}>
            <button onClick={getYoutubeVideos}>Get Youtube Videos</button>
            <button onClick={getGeneralData}>Get Youtube General Data</button>
            {'snippet' in generalData && <GeneralDataComponent data={generalData} />}
            {videosData.map(video => <SingleVideo key={`video_disp_${video.video_id}`} video={video} />)}
        </div>
    );
}

function GeneralDataComponent({ data }) {
    return <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <label style={{ fontWeight: 'bold' }}>Username: {data.snippet.title}</label>
            <img src={data.snippet.thumbnails.default.url} style={{ width: "50%" }} alt={"IMG_" + data.snippet.title} />
        </div>
        <hr></hr>
        <h2>Statistics:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label style={{ fontWeight: 'bold' }}>View Count:</label>
                <label>{data.statistics.viewCount}</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label style={{ fontWeight: 'bold' }}>Published Videos:</label>
                <label>{data.statistics.videoCount}</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label style={{ fontWeight: 'bold' }}>Subscribers:</label>
                <label>{data.statistics.subscriberCount}</label>
            </div>
        </div>
    </div>
}

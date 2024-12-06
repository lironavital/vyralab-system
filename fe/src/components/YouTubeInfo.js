import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { toast } from 'react-toastify'
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
        <div style={{ marginTop: '100px' }}>
            <button onClick={getYoutubeVideos}>Get Youtube Videos</button>
            <button onClick={getGeneralData}>Get Youtube General Data</button>
            {'snippet' in generalData && <GeneralDataComponent data={generalData} />}
            {videosData.length > 0 && <VideoDataComponent data={videosData} />}
        </div>
    );
}

function VideoDataComponent({ data }) {
    return <div style={{}}>
        {data.map(video => {
            const infoStyle = { display: 'flex', flexDirection: 'row', gap: '0.3dvw', }
            const videoURL = `https://youtube.com/watch?v=${video.video_id}`
            return <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1dvw', marginBottom: '2dvh' }}>
                <img src={video.thumbnail_url} style={{ width: "10%", minWidth: '150px' }} alt={video.title} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={infoStyle}>
                        <label>Video ID:</label>
                        <label>{video.video_id}</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Video Link:</label>
                        <a href={videoURL} target='_blank' rel="noreferrer">{videoURL}</a>
                    </div>
                    <div style={infoStyle}>
                        <label>Title:</label>
                        <label>{video.title}</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Duration:</label>
                        <label>{video.duration}s</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Views:</label>
                        <label>{video.views}</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Likes:</label>
                        <label>{video.likes}</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Dislikes:</label>
                        <label>{video.dislikes}</label>
                    </div>
                    <div style={infoStyle}>
                        <label>Comments:</label>
                        <label>{video.comments}</label>
                    </div>
                </div>
            </div>
        })}
    </div>
}

function GeneralDataComponent({ data }) {
    return <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <label>Username: {data.snippet.title}</label>
            <img src={data.snippet.thumbnails.default.url} style={{ width: "10%" }} alt={"IMG_" + data.snippet.title} />
        </div>
        <hr></hr>
        <h2>Statistics:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label>View Count:</label>
                <label>{data.statistics.viewCount}</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label>Published Videos:</label>
                <label>{data.statistics.videoCount}</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label>Subscribers:</label>
                <label>{data.statistics.subscriberCount}</label>
            </div>
        </div>
    </div>
}

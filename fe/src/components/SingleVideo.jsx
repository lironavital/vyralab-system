import { useState } from "react"
import ShowPopup from "../hooks/ShowPopup"
import VideoLinking from "./VideoLinking"

export default function SingleVideo({ video, showLinking = true, handleLinking }) {
    const infoStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.3dvw', }

    const [showVideoLinking, setShowVideoLinking] = useState(false)

    const { platform } = video
    let videoURL = ''

    switch (platform) {
        case 'youtube':
            videoURL = `https://youtube.com/watch?v=${video.video_id}`
            break;
        case 'tiktok':
            videoURL = `https://www.tiktok.com/{TIKTOK_USER_ID}/video/${video.video_id}`
            break;
        default:
            return
    }

    return <>
        {showLinking && <ShowPopup isShowingState={showVideoLinking} closeFunction={() => { setShowVideoLinking(prev => !prev) }} width="60%">
            <VideoLinking videoID={video.video_id} platform={video.platform} />
        </ShowPopup>}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1dvw', marginBottom: '2dvh' }} onClick={() => { !showLinking && handleLinking({ video_id: video.video_id, platform: video.platform }) }}>
            {showLinking && <button style={{ fontSize: '20px' }} onClick={() => { setShowVideoLinking(true) }}>⛓️‍💥</button>}
            {showLinking && video.linked_tiktok && <>LINKED TO TIKTOK</>}
            {showLinking && video.linked_youtube && <>LINKED TO YOUTUBE</>}
            {showLinking && video.linked_facebook && <>LINKED TO FACEBOOK</>}
            <img src={video.thumbnail_url} style={{ width: "10%", minWidth: '150px' }} alt={video.title} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Video ID:</label>
                    <span>{video.video_id}</span>
                </div>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Video Link:</label>
                    <a href={videoURL} target='_blank' rel="noreferrer">{videoURL}</a>
                </div>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Title:</label>
                    <span>{video.title}</span>
                </div>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Duration:</label>
                    <span>{video.duration}s</span>
                </div>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Views:</label>
                    <span>{(+video.views).toLocaleString()}</span>
                </div>
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Likes:</label>
                    <span>{(+video.likes).toLocaleString()}</span>
                </div>
                {platform === "youtube" && <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Dislikes:</label>
                    <span>{(+video.dislikes).toLocaleString()}</span>
                </div>}
                <div style={infoStyle}>
                    <label style={{ fontWeight: 'bold' }}>Comments:</label>
                    <span>{(+video.comments).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </>
}
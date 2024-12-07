export default function SingleVideo({ video }) {

    const infoStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.3dvw', }

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
                <label>{video.views.toLocaleString()}</label>
            </div>
            <div style={infoStyle}>
                <label>Likes:</label>
                <label>{video.likes.toLocaleString()}</label>
            </div>
            {platform === "youtube" && <div style={infoStyle}>
                <label>Dislikes:</label>
                <label>{video.dislikes.toLocaleString()}</label>
            </div>}
            <div style={infoStyle}>
                <label>Comments:</label>
                <label>{video.comments.toLocaleString()}</label>
            </div>
        </div>
    </div>
}
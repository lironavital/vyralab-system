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
}
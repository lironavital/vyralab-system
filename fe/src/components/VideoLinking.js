import { useEffect, useState } from 'react'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import { platformLogos } from '../static/platforms'
import SingleVideo from './SingleVideo'
const config = getConfig()

export default function VideoLinking({ videoID, platform }) {
    const [selectedPlatform, setSelectedPlatform] = useState(false)
    const [selectedPlatformVideos, setSelectedPlatformVideos] = useState([])

    async function getSelectedPlatformVideos() {
        const resp = await axios.get(`${config.backend}/${selectedPlatform}/videos`)
        setSelectedPlatformVideos(resp.data)
    }

    useEffect(() => {
        if (selectedPlatform) {
            getSelectedPlatformVideos()
        }
    }, [selectedPlatform])

    function handleLinking({ video_id, platform }) {
        if (videoID) {
            // ID to link to: videoID
            // ID of the linked video: video_id
            // Platform of the linked video: platform
            const res = window.confirm(`I'm gonna link Video ${videoID} from X to video ${video_id}, from ${platform}`)

            if (res) {
                alert("OK Boss")
            }
            else {
                alert("Not Linking")
            }
        }
    }


    return (
        <div style={{ display: 'flex', minHeight: '30vh', maxHeight: '80vh', marginLeft: 'auto', marginRight: 'auto', gap: '5dvw', justifyContent: 'center', backgroundColor: 'white', border: 'black solid 1px', borderRadius: '5px', overflow: 'auto' }}>
            {!selectedPlatform && <PlatformSelection currentPlatform={platform} setSelectedPlatform={setSelectedPlatform} />}
            {selectedPlatformVideos.length > 0 && <div>
                {selectedPlatformVideos.map(video => <div key={`video_selection_${video.video_id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: 'black solid 1px', cursor: 'pointer', marginBottom: '1vh' }}>
                    {platformLogos[selectedPlatform].imgJSX}
                    <SingleVideo video={video} showLinking={false} handleLinking={handleLinking} />
                </div>)}
            </div>}
        </div>
    );
}

function PlatformSelection({ currentPlatform, setSelectedPlatform }) {
    const platformsToShow = Object.keys(platformLogos).filter(i => i !== currentPlatform)

    return <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <h1>Select a platform to link video to:</h1>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            {platformsToShow.map(platform => <div key={`selecting_platform_${platform}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setSelectedPlatform(platform) }}>
                {platformLogos[platform].imgJSX}
                {platformLogos[platform].prettyName}
            </div>)}
        </div>
    </div>

}
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
const config = getConfig()

const platformLogos = {
    youtube: <img width="48" height="48" src="https://img.icons8.com/color/48/youtube-play.png" alt="youtube-play" />,
    tiktok: <img width="48" height="48" src="https://img.icons8.com/color/48/tiktok--v1.png" alt="tiktok--v1" />,
    facebook: <img width="48" height="48" src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="instagram-new--v1" />,
}

export default function LoginToPlatforms({ }) {
    const [loggedPlatforms, setLoggedPlatforms] = useState({})

    async function getLoggedPlatformsStatus() {
        const resp = await axios.get(`${config.backend}/platforms/logged`)
        setLoggedPlatforms(resp.data)
    }

    useEffect(() => {
        getLoggedPlatformsStatus()
    }, [])


    const loadFacebookSDK = () => {
        if (window.FB) return; // If SDK is already loaded, skip

        const script = document.createElement('script');
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.onload = () => {
            window.FB.init({
                appId: config.fb_app_id,
                cookie: true,
                xfbml: true,
                version: 'v21.0'
            });

            window.FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    console.log(response.authResponse.accessToken)
                }
                else {
                    console.log("LOGINSTATUS:", response.status)
                }
            });
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        loadFacebookSDK();
    }, []);

    const handleFacebookLogin = () => {
        window.FB.login((response) => {
            if (response.authResponse) {
                (async () => {
                    try {
                        const accessToken = response.authResponse.accessToken;
                        await axios.post(`${config.backend}/platforms/add`, { platform: 'facebook', resp: response.authResponse });
                        window.location.reload()
                    } catch (error) {
                        console.error("Error posting to backend:", error);
                    }
                })();
            } else {
                console.error("User did not authenticate with Facebook");
            }
        }, { scope: 'public_profile,email' });
    };

    async function handleLogout(platform) {
        const resp = await axios.post(`${config.backend}/platforms/remove`, { platform })
        window.location.reload()
    }

    return (
        <div style={{ display: 'flex', paddingTop: '5dvw', paddingBottom: '5dvw', width: '100%', gap: '5dvw', justifyContent: 'center', backgroundColor: 'crimson' }}>
            {/* LOGGED BUTTONS */}
            {Object.keys(loggedPlatforms).map(platform => {
                if (!loggedPlatforms[platform]) {
                    let loginFunc = () => { }
                    switch (platform) {
                        case 'facebook':
                            loginFunc = handleFacebookLogin
                            break;
                        default:
                            loginFunc = () => { }
                            break;
                    }
                    return returnPlatformByName({ platformName: platform, loginFunc });
                } else {
                    return (
                        <div key={platform} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            {/* <h1>{platform} Logged!</h1> */}
                            {platformLogos[platform]}
                            <button onClick={() => handleLogout(platform)}>Logout</button>
                        </div>
                    );
                }
            })}
        </div>
    );
}

// NOT LOGGED BUTTONS 
function returnPlatformByName({ platformName, loginFunc }) {
    switch (platformName) {
        case 'facebook':
            return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                {/* <h1>Facebook Login</h1> */}
                {platformLogos[platformName]}
                <button onClick={loginFunc}>Login with Facebook</button>
            </div>

        case 'tiktok':
            return <div key="tiktok" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                {/* <h1>TikTok Login</h1> */}
                {platformLogos[platformName]}
                <button onClick={e => window.location = `${config.backend}/oauth/tiktok`}>Login with TikTok</button>
            </div>
        case 'youtube':
            return <div key="youtube" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                {/* <h1>YouTube Login</h1> */}
                {platformLogos[platformName]}
                <button onClick={e => window.location = `${config.backend}/oauth/youtube`}>Login with YouTube</button>
            </div>

        default:
            return
    }
}
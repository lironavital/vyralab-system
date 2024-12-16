import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import LoginToPlatforms from '../components/LoginToPlatforms'
import TikTokInfo from '../components/TikTokInfo'
import YouTubeInfo from '../components/YouTubeInfo'
import Header from '../components/Header'
import ShowPopup from '../hooks/ShowPopup'
const config = getConfig()

export default function Main({ }) {



    return (<div>


        {/* Show General Data Here */}


        {/* <TikTokInfo getLoggedPlatformsStatus={getLoggedPlatformsStatus} />
        <YouTubeInfo getLoggedPlatformsStatus={getLoggedPlatformsStatus} /> */}
    </div>)
}
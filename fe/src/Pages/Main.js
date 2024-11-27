import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import LoginToPlatforms from '../components/LoginToPlatforms'
import TikTokInfo from '../components/TikTokInfo'
import YouTubeInfo from '../components/YouTubeInfo'
const config = getConfig()

export default function Main({ }) {

    return (<div>
        <LoginToPlatforms />

        <TikTokInfo />
        <YouTubeInfo />
    </div>)
}
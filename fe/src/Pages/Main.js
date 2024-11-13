import { useEffect, useState } from 'react'
import '../main.css'
import axios from 'axios'
import { getConfig } from '../config/getConfig'
import LoginToPlatforms from '../components/LoginToPlatforms'
const config = getConfig()

export default function Main({ }) {
    return (<div>
        HI
        <LoginToPlatforms />
    </div>)
}
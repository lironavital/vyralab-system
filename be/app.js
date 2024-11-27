require('dotenv').config()
const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const app = express()
const login_route = require('./routes/login')
const platforms_route = require('./routes/platforms')
const { app: oauth_route } = require('./routes/oauth')
const tiktok_route = require('./routes/tiktok')
const youtube_route = require('./routes/youtube')
// const ip2loc = require("ip2location-nodejs");
const path = require('path')
const pg = require('./db/postgres')

//NODE SETTINGS
const acceptOrigin = process.env.NODE_ENV === "development" ? ["http://localhost:3001", "http://localhost:3000"] : ["https://hls-links.web.app", "https://links.herlastsight.com", "https://be-cpde7aopyq-uc.a.run.app", 'https://herlastsight.com', 'https://s.herlastsight.com']
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: acceptOrigin
}))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.set('trust proxy', true)
//NODE SETTINGS

//ROUTES
app.use('/login', login_route)
app.use('/platforms', platforms_route)
app.use('/oauth', oauth_route)
app.use('/tiktok', tiktok_route)
app.use('/youtube', youtube_route)
app.get('/', (req, res) => {
    res.send("HLS")
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    // console.log("Setting up IP2LOCATION")
    // const ip2loc_ipv4 = new ip2loc.IP2Location()
    // const ip2loc_ipv6 = new ip2loc.IP2Location()
    // ip2loc_ipv4.open(path.join(__dirname, 'ip2location', 'IPV4.BIN'))
    // ip2loc_ipv6.open(path.join(__dirname, 'ip2location', 'IPV6.BIN'))

    // global.ipv4 = ip2loc_ipv4
    // global.ipv6 = ip2loc_ipv6

    console.log("App is litening on http://localhost:" + PORT)
})
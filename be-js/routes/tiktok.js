const app = require('express').Router()
const { getConfig } = require('../config/getConfig')
const { signJWT, validateJWT } = require('../middlewares/jwt')
const axios = require('axios')
const config = getConfig()

app.get('/videos', validateJWT, async (req, res) => {
    try {
        const TIKTOK_API_BASE = `https://open.tiktokapis.com/v2`
        const videos = []
        const user = req.userData
        const token = user.tt_act
        if (!token) {
            return res.sendStatus(401)
        }
        let cursor = null

        while (true) {
            const response = await axios.post(`${TIKTOK_API_BASE}/video/list/`, { "max_count": 20, "cursor": cursor }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: { fields: 'id,create_time,cover_image_url,video_description,duration,height,width,title,like_count,comment_count,share_count,view_count' }
            })
            if (response.data.error.code !== "ok") {
                return res.status(400).send('Error fetching videos')
            }
            videos.push(...response.data.data.videos)
            if (!response.data.data.has_more) {
                break
            }
            cursor = response.data.data.cursor
        }

        return res.json(videos)

    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = app











// ONCE RESEARCH API IS APPROVED:

// const response = await axios.post(`${TIKTOK_API_BASE}/research/user/info/`, {
//     username:'liron_hls'
//     // start_date: '2024-06-01',
//     // end_date: '2024-11-27',
// }, {
//     params: {
//         fields: [
//             'profile_view',
//             'follower_count',
//             'likes_count',
//             'video_views',
//             'comment_count',
//             'share_count'
//         ].join(',')
//     },
//     headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'text/plain'
//     },
// });

// return {
//     date,
//     dailyStats: response.data.data,
//     totalFollowers: response.data.data.follower_count
// };

import { Request, Response, Router } from 'express';
const app = Router()
import { signJWT, validateJWT } from '../middlewares/jwt';
import axios from 'axios';
import { getConfig } from '../config/getConfig';
const config = getConfig()

app.get('/videos', validateJWT, async (req: Request, res: Response) => {
    try {
        const TIKTOK_API_BASE = `https://open.tiktokapis.com/v2`
        const videos = []
        const user = req.userData
        if (user) {
            const token = user.tt_act
            if (!token) {
                res.sendStatus(401)
            }
            let cursor = null

            while (true) {
                const response = await axios.post(`${TIKTOK_API_BASE}/video/list/`, { "max_count": 20, "cursor": cursor }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: { fields: 'id,create_time,cover_image_url,video_description,duration,height,width,title,like_count,comment_count,share_count,view_count' }
                }) as any
                if (response.data.error.code !== "ok") {
                    res.status(400).send('Error fetching videos')
                }
                videos.push(...response.data.data.videos)
                if (!response.data.data.has_more) {
                    break
                }
                cursor = response.data.data.cursor
            }

            res.json(videos)
        }
        else {
            throw { status: 401, message: "User Not Found" }
        }
    } catch (error: any) {
        if (error.status === 401) {
            debugger
        }
        else {
            res.status(400).send(error.message)
        }
    }
})


export default app



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

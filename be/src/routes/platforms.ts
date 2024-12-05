import { Request, Response, Router } from 'express';
const app = Router()
import { validateJWT } from '../middlewares/jwt';
import { updateUser } from '../db/postgres'
import dateFns from 'date-fns'
import { get_tiktok_access_token_from_refresh_token } from '../controllers/tiktokAccessToken';
import { get_youtube_access_token_from_refresh_token } from '../controllers/youtubeAccessToken';

app.get('/logged', validateJWT, async (req: Request, res: Response) => {
    const loggedPlatforms = { facebook: false, tiktok: false, youtube: false }
    const registeredUser = req.userData
    if (registeredUser) {
        if (registeredUser.fb_act) {
            loggedPlatforms.facebook = true
        }
        else {
            loggedPlatforms.facebook = false
        }
        if (registeredUser.tt_act) {
            loggedPlatforms.tiktok = true
        }
        else {
            loggedPlatforms.tiktok = false
        }
        if (registeredUser.yt_act) {
            loggedPlatforms.youtube = true
        }
        else {
            loggedPlatforms.youtube = false
        }
    }
    res.json(loggedPlatforms)
})

app.post('/add', validateJWT, async (req: Request, res: Response): Promise<any> => {
    const data = req.body
    const newFields = {} as any

    // Create new fields
    if (data.platform === 'facebook') {
        newFields.fb_act = data.resp.accessToken
        const expirationTimeInSeconds = data.resp.expiresIn
        const expirationTimestamp = dateFns.addSeconds(new Date(), expirationTimeInSeconds)
        const formattedTimestamp = expirationTimestamp.toISOString().slice(0, 19).replace('T', ' ')
        newFields.fb_act_expire = formattedTimestamp
    }

    if (data.platform === 'tiktok') {
        if ('tt_act' in data.resp) {
            newFields.tt_act = data.resp.tt_act
        }
        if ('tt_refresh_token' in data.resp) {
            newFields.tt_refresh_token = data.resp.tt_refresh_token
            const tiktok_accessToken_fields = await get_tiktok_access_token_from_refresh_token(newFields.tt_refresh_token)
            if (tiktok_accessToken_fields.accessToken && tiktok_accessToken_fields.expire) {
                newFields.tt_act = tiktok_accessToken_fields.accessToken
                newFields.tt_act_expire = tiktok_accessToken_fields.expire
            }
            else {
                return res.sendStatus(500)
            }
        }
    }
    if (data.platform === 'youtube') {
        if ('yt_refresh_token' in data.resp) {
            newFields.yt_refresh_token = data.resp.yt_refresh_token
            const youtube_accessToken_fields = await get_youtube_access_token_from_refresh_token(data.resp.yt_refresh_token)
            if (youtube_accessToken_fields.accessToken && youtube_accessToken_fields.expire) {
                newFields.yt_act = youtube_accessToken_fields.accessToken
                newFields.yt_act_expire = youtube_accessToken_fields.expire
            }
            else {
                return res.sendStatus(500)
            }
        }
    }

    // Update DB
    if ('userData' in req && req.userData && 'id' in req.userData) {
        await updateUser(req.userData.id, newFields)
        return res.sendStatus(200)
    }
    else {
        console.log("Never happens, but I hate TypeScript :)")
        return res.sendStatus(401)
    }
})

app.post('/remove', validateJWT, async (req: Request, res: Response) => {
    const data = req.body
    const newFields = {} as any

    // Set Fields to NULL
    if (data.platform === 'facebook') {
        newFields.fb_act = null
        newFields.fb_act_expire = new Date().toISOString()
    }
    if (data.platform === 'tiktok') {
        newFields.tt_refresh_token = null
        newFields.tt_act = null
        newFields.tt_act_expire = new Date().toISOString()
    }
    if (data.platform === 'youtube') {
        newFields.yt_refresh_token = null
        newFields.yt_act = null
        newFields.yt_act_expire = new Date().toISOString()
    }

    // Update DB
    if ('userData' in req && req.userData && 'id' in req.userData) {
        await updateUser(req.userData.id, newFields)
        res.sendStatus(200)
    }
    else {
        console.log("Never happens, but I hate TypeScript :)")
        res.sendStatus(401)
    }
})

module.exports = app


// async function facebook_getManagedPages(accessToken: string) {
//     try {
//         const response = await axios.get('https://graph.facebook.com/v21.0/me/home', {
//             params: {
//                 access_token: accessToken,
//             },
//         });

//         debugger
//         return response.data;
//     } catch (error: any) {
//         console.error('Error fetching managed pages:', error.response ? error.response.data : error.message);
//     }
// }

export default app
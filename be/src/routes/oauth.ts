import { Request, Response, Router } from 'express';
const app = Router()
import { signJWT } from '../middlewares/jwt';
import { getConfig } from '../config/getConfig';
const querystring = require('querystring')
const config = getConfig()
import { Credentials, OAuth2Client } from 'google-auth-library'

app.get('/tiktok', async (req: Request, res: Response) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    const tiktok_redirect_uri = `https://www.tiktok.com/v2/auth/authorize/`

    const query = {
        client_key: process.env.tiktok_client_key,
        scope: "user.info.basic,video.upload,artist.certification.read,artist.certification.update,user.info.profile,user.info.stats,video.list",
        response_type: "code",
        redirect_uri: process.env.tiktok_redirect_uri,
        state: csrfState,
    }
    const finalURI = tiktok_redirect_uri + '?' + querystring.stringify(query)
    return res.redirect(finalURI)
})

app.get('/tt_redirect', async (req: Request, res: Response) => {
    return tt_redirect_logic(req, res)
})

function tt_redirect_logic(req: Request, res: Response) {
    // const route = req.route.path
    // const isDevRoute = route.includes('dev') ? true : false

    const refresh_token = req.query.code
    if (refresh_token) {
        return res.redirect(`${config.frontend}/tt_act?code=${req.query.code}`)
    }
    else {
        return res.redirect(`${config.frontend}/404`)
    }
}


const oauth2Client = new OAuth2Client(
    process.env.youtube_client_id,
    process.env.youtube_client_secret,
    process.env.youtube_redirect_uri
);

app.get('/youtube', async (req: Request, res: Response) => { // http://localhost:3333/oauth/youtube
    const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/service.management',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtubepartner',
        'https://www.googleapis.com/auth/youtubepartner-channel-audit',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
        'https://www.googleapis.com/auth/youtube.third-party-link.creator',
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    console.log('redirect:', url)
    return res.redirect(url)
})

async function getYoutubeAccessToken(code: string): Promise<Credentials | boolean> {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    } catch (error: any) {
        if (error.status === 400) {
            return false
        }
        else {
            return false
        }
    }
}

export { app, getYoutubeAccessToken } 
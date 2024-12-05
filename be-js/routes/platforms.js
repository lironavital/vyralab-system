const app = require('express').Router()
const { signJWT, validateJWT } = require('../middlewares/jwt')
const qs = require('qs');
const axios = require('axios');
const { getUserById, updateUser } = require('../db/postgres')
const dateFns = require('date-fns');
const { getYoutubeAccessToken } = require('./oauth');

app.get('/logged', validateJWT, async (req, res) => {
    const loggedPlatforms = {}
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
    return res.json(loggedPlatforms)
})

app.post('/add', validateJWT, async (req, res) => {
    const data = req.body
    const newFields = {}
    //UPDATE DB
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
            const response = await getTikTokAccessToken({ tt_refresh_token: newFields.tt_refresh_token })
            if (response) {
                newFields.tt_act = response.tt_act
                const expirationTimeInSeconds = response.tt_act_expire
                const expirationTimestamp = dateFns.addSeconds(new Date(), expirationTimeInSeconds)
                const formattedTimestamp = expirationTimestamp.toISOString().slice(0, 19).replace('T', ' ')
                newFields.tt_act_expire = formattedTimestamp
            }
        }
    }
    if (data.platform === 'youtube') {
        if ('yt_refresh_token' in data.resp) {
            newFields.yt_refresh_token = data.resp.yt_refresh_token
            const response = await getYoutubeAccessToken(data.resp.yt_refresh_token)
            newFields.yt_act = response.access_token
            const expirationTimestamp = new Date(response.expiry_date)
            const formattedTimestamp = expirationTimestamp.toISOString().slice(0, 19).replace('T', ' ')
            newFields.yt_act_expire = formattedTimestamp
        }
    }

    await updateUser(req.userData.id, newFields)

    return res.sendStatus(200)
})

app.post('/remove', validateJWT, async (req, res) => {
    const data = req.body
    const newFields = {}
    //UPDATE DB
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

    await updateUser(req.userData.id, newFields)

    return res.sendStatus(200)
})

module.exports = app


async function getTikTokAccessToken({ tt_refresh_token }) {
    const data = qs.stringify({
        client_key: process.env.tiktok_client_key,
        client_secret: process.env.tiktok_secret,
        code: tt_refresh_token,
        grant_type: "authorization_code",
        redirect_uri: process.env.tiktok_redirect_uri
    })

    try {
        const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        });
        if ('access_token' in response.data) {
            return { tt_act: response.data.access_token, tt_act_expire: response.data.expires_in }
        }
        else {
            return false
        }
    } catch (error) {
        return false
    }
}

async function facebook_getManagedPages(accessToken) {
    try {
        const response = await axios.get('https://graph.facebook.com/v21.0/me/home', {
            params: {
                access_token: accessToken,
            },
        });

        debugger
        return response.data;
    } catch (error) {
        console.error('Error fetching managed pages:', error.response ? error.response.data : error.message);
    }
}
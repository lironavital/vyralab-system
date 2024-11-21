const app = require('express').Router()
const { signJWT } = require('../middlewares/jwt')
const { getConfig } = require('../config/getConfig')
const querystring = require('querystring')
const config = getConfig()

app.get('/tiktok', async (req, res) => {
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

app.get('/tt_redirect', async (req, res) => {
    return tt_redirect_logic(req, res)
})

function tt_redirect_logic(req, res) {
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

module.exports = app 
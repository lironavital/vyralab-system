const app = require('express').Router()
const { db, getUserByUsernameAndPassword } = require('../db/localDB')
const { signJWT } = require('../middlewares/jwt')
const { getConfig } = require('../config/getConfig')
const config = getConfig()

app.get('/tt_redirect', async (req, res) => {
    return tt_redirect_logic(req, res)
})

app.get('/tt_redirect_dev', async (req, res) => {
    return tt_redirect_logic(req, res)
})

function tt_redirect_logic(req, res) {
    // const route = req.route.path
    // const isDevRoute = route.includes('dev') ? true : false
    if (req.query.code) {
        return res.redirect(`${config.frontend}/tt_act?code=${req.query.code}`)
    }
    else {
        return res.redirect(`${config.frontend}/404`)
    }
}

module.exports = app 
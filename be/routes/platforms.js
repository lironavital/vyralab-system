const app = require('express').Router()
const { db, getUserById, updateUser } = require('../db/localDB')
const { signJWT, validateJWT } = require('../middlewares/jwt')


app.get('/logged', validateJWT, async (req, res) => {
    const loggedPlatforms = {}
    const registeredUser = getUserById(req.userData.id)
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
        newFields.fb_act_expire = data.resp.expiresIn
    }

    updateUser(req.userData.id, newFields)

    return res.sendStatus(200)
})

module.exports = app 
const app = require('express').Router()
const { db, getUserByUsernameAndPassword } = require('../db/localDB')
const { signJWT } = require('../middlewares/jwt')

app.post('/', async (req, res) => {
    const password = req.body.password
    const username = req.body.username

    const registeredUser = getUserByUsernameAndPassword({ username, password })

    if (registeredUser) {
        const token = signJWT({ id: registeredUser.userID, firstName: registeredUser.firstName, lastName: registeredUser.lastName })

        res.cookie("vyralab_token", token, { httpOnly: true, secure: process.env.NODE_ENV !== "production", sameSite: "Strict" });

        res.status(200).send("User is logged in!");
    }
    else {
        return res.sendStatus(401)
    }
})

app.get('/status', async (req, res) => {
    if (req.cookies['vyralab_token']) {
        return res.sendStatus(200)
    }
    else {
        return res.sendStatus(401)
    }
})

app.delete('/', async (req, res) => {
    if (req.cookies['vyralab_token']) {
        res.clearCookie('vyralab_token')
        return res.sendStatus(200)
    }
    else {
        return res.sendStatus(401)
    }
})

module.exports = app 
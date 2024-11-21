const app = require('express').Router()
const { getUserByEmailAndPassword } = require('../db/postgres')
const { signJWT } = require('../middlewares/jwt')

app.post('/', async (req, res) => {
    const password = req.body.password
    const email = req.body.email

    const registeredUser = await getUserByEmailAndPassword({ email, password })

    if (registeredUser) {
        const token = signJWT({ id: registeredUser.id, firstName: registeredUser.firstname, lastName: registeredUser.lastname })

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
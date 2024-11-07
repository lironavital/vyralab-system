const app = require('express').Router()
const { signJWT } = require('../middlewares/jwt')

const creds = { username: 'Adm33nD0H37@L4st@S1ght', password: '!*(_RJ!(UN@()_I!@()+R(_UNGB' }

app.post('/', async (req, res) => {
    const password = req.body.password
    const username = req.body.username

    if (username === creds.username && password === creds.password) {
        return res.status(200).json({ logged: true, key: signJWT({ hlsAdmin: true }) })
    }
    else {
        return res.sendStatus(401)
    }
})


module.exports = app 
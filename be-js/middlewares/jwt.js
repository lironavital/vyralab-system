const jwt = require('jsonwebtoken')
const { getUserById } = require('../db/postgres')
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

// const map = new Map()

const signJWT = (data) => {
    const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '30d' })
    return token
}

const validateJWT = async (req, res, next) => {
    try {
        const token = req.cookies['vyralab_token']
        const user = jwt.verify(token, JWT_PRIVATE_KEY)
        // const userDataFromMap = map.get(user.id)
        // if (userDataFromMap) {
        // req.userData = userDataFromMap
        // }
        // else {
        const userData = await getUserById(user.id)
        // map.set(user.id, userData)
        req.userData = userData
        // }
        next()
    } catch (error) {
        res.sendStatus(401)
    }
}

module.exports = { signJWT, validateJWT, }
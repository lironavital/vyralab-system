const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

const signJWT = (data) => {
    const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '30d' })
    return token
}

const validateJWT = (req, res, next) => {
    try {
        const token = req.cookies['vyralab_token']
        const user = jwt.verify(token, JWT_PRIVATE_KEY)
        req.userData = user
        next()
    } catch (error) {
        res.sendStatus(401)
    }
}

module.exports = { signJWT, validateJWT, }
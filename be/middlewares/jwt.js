const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = "&*()YASD*()F*(NQ#&(GB&*G!#&*)G!#&)GNJKLBADSFBLAB QAWUHRH(_UQ!( &*%!G%"

const signJWT = (data) => {
    const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '30d' })
    return token
}

const validateJWT = (req, res, next) => {
    try {
        const token = req.headers["hls-ad"]
        const user = jwt.verify(token, JWT_PRIVATE_KEY)
        next()
    } catch (error) {
        res.sendStatus(401)
    }
}

module.exports = { signJWT, validateJWT, }
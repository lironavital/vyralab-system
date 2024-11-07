const devConfig = require('./development.json')
const prodConfig = require('./production.json')

function getConfig() {
    const env = process.env.NODE_ENV

    switch (env) {
        case "development":
            return devConfig
        case "production":
            return prodConfig
        default:
            return prodConfig
    }
}

module.exports = { getConfig }
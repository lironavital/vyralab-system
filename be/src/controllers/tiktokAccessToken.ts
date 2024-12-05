import axios from 'axios'
import dateFns from 'date-fns'
import QueryString from 'qs'

async function get_tiktok_access_token_from_refresh_token(refreshToken: string): Promise<{ accessToken: string, expire: string }> {
    const responseObject = { accessToken: '', expire: '' }
    const response = await getTikTokAccessToken({ tt_refresh_token: refreshToken })
    if (response) {
        const expirationTimeInSeconds = response.tt_act_expire
        const expirationTimestamp = dateFns.addSeconds(new Date(), expirationTimeInSeconds)
        const formattedTimestamp = expirationTimestamp.toISOString().slice(0, 19).replace('T', ' ')
        
        responseObject.accessToken = response.tt_act
        responseObject.expire = formattedTimestamp
    }
    return responseObject
}

async function getTikTokAccessToken({ tt_refresh_token }: { tt_refresh_token: string }) {
    const data = QueryString.stringify({
        client_key: process.env.tiktok_client_key,
        client_secret: process.env.tiktok_secret,
        code: tt_refresh_token,
        grant_type: "authorization_code",
        redirect_uri: process.env.tiktok_redirect_uri
    })

    try {
        const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        });
        if ('access_token' in response.data) {
            return { tt_act: response.data.access_token, tt_act_expire: response.data.expires_in }
        }
        else {
            return false
        }
    } catch (error) {
        return false
    }
}

export { getTikTokAccessToken, get_tiktok_access_token_from_refresh_token }
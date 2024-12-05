import { getYoutubeAccessToken } from '../routes/oauth'

async function get_youtube_access_token_from_refresh_token(refreshToken: string): Promise<{ accessToken: string | null, expire: string | null }> {
    const responseObject = { accessToken: null, expire: null } as { accessToken: string | null, expire: string | null }
    const response = await getYoutubeAccessToken(refreshToken)
    if (typeof response === 'object') {
        if (typeof response.access_token === 'string' && typeof response.expiry_date === "number") {
            const expirationTimestamp = new Date(response.expiry_date)
            const formattedTimestamp = expirationTimestamp.toISOString().slice(0, 19).replace('T', ' ')

            responseObject.accessToken = response.access_token
            responseObject.expire = formattedTimestamp
        }
        else {
            debugger
            console.log("WRONG TYPES!")
        }
    }
    else {
        console.log("No valid access token gotten.")
    }
    
    return responseObject
}

export { get_youtube_access_token_from_refresh_token, }
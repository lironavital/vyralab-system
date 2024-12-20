import { Request, Response, Router } from 'express';
const app = Router()
import { signJWT, validateJWT } from '../middlewares/jwt';
import { getConfig } from '../config/getConfig';
import dateFns from 'date-fns'
const config = getConfig()
import { google, youtube_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
import { get_youtube_access_token_from_refresh_token } from '../controllers/youtubeAccessToken';
import { addVideo, addVideoArray, getDataFreshnessByUserAndPlatform, getVideosByUserAndPlatform, setDataFreshnessByUserAndPlatform, updateUser } from '../db/postgres';
import { User, YouTubeVideo } from '../types/global';
import convert_ISO_8601_to_seconds from '../functions/convert_ISO_8601';
import fs from 'fs'
import { formatYouTubeVideos } from '../functions/format_videos';

app.get('/videos', validateJWT, async (req: Request, res: Response) => {
    try {
        const user = req.userData
        if (user) {
            const { data_freshness } = await getDataFreshnessByUserAndPlatform(user.id, 'youtube')

            const timeNowUTC = new Date().toISOString(); // Current UTC time
            const dataFreshnessUTC = dateFns.format(new Date(data_freshness), 'yyyy-MM-dd HH:mm:ss').replace(' ', 'T') + '.422Z'
            const diff = dateFns.differenceInSeconds(timeNowUTC, dataFreshnessUTC)
            if (data_freshness && diff < config.youtube_data_freshness_seconds) { // Data is older than what has been set as a threshold
                const savedVideos = await getVideosByUserAndPlatform(user.id, 'youtube')
                res.json(savedVideos)
            }
            else { // User gets New Data
                // const allVideos = require('../../youtube.json')
                const allVideos = await getAllYouTubeVideos(user)
                const formattedVideos = formatYouTubeVideos(allVideos, user)
                res.json(formattedVideos)
                await addVideoArray(formattedVideos)
                await setDataFreshnessByUserAndPlatform(user.id, 'youtube')
            }
        }
        else {
            throw { status: 400, message: 'User Not Found' }
        }

    } catch (err: any) {
        if (err?.status === 401) {
            if (req.userData?.yt_refresh_token) {
                const token = await get_youtube_access_token_from_refresh_token(req.userData.yt_refresh_token)
                await updateUser(req.userData.id, { yt_act: token.accessToken, yt_act_expire: token.expire })
                if (token.accessToken) {
                    try {
                        const allVideos = await getAllYouTubeVideos(req.userData)
                        res.json(allVideos)
                    } catch (error: any) {
                        res.status(500).send(error.message)
                    }
                }
                else {
                    res.status(401).send("User is not logged to YouTube anymore!")
                }
            }
            else {
                res.status(401).send("User is not logged to YouTube anymore!")
            }
        }
        else {
            res.status(500).send(err.message)
        }
    }
})

app.get('/generalData', validateJWT, async (req, res) => {
    try {
        const user = req.userData
        const token = user?.yt_act
        if (!token) {
            throw { status: 401, message: "User Not Found" }
        }
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: token });
        const youtube = google.youtube({
            version: 'v3',
            auth, // OAuth2 client
            key: process.env.youtube_api_key, // API key for identity
        });

        const resp = await getChannel(youtube)
        if (resp?.items) {
            res.json(resp.items[0])
        }
        else {
            res.json({})
        }

    } catch (err: any) {
        if (err?.status === 401) {
            if (req.userData?.yt_refresh_token) {
                const token = await get_youtube_access_token_from_refresh_token(req.userData.yt_refresh_token)
                await updateUser(req.userData.id, { yt_act: token.accessToken, yt_act_expire: token.expire })
                if (token.accessToken) {
                }
                else {
                    res.status(401).send("User is not logged to YouTube anymore!")
                }
            }
            else {
                res.status(401).send("User is not logged to YouTube anymore!")
            }
        }
    }
})


export default app



const getChannel = async (youtube: youtube_v3.Youtube) => {
    const response = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true
    });
    return response.data;
};

const getVideos = async (youtube: youtube_v3.Youtube, maxResults = 10, pageToken: string) => {
    // First, get the video IDs through search
    const searchResponse = await youtube.search.list({
        part: ['snippet'],
        forMine: true,
        maxResults,
        pageToken,
        type: ['video']
    });

    if (!searchResponse.data.items?.length) {
        return searchResponse.data;
    }

    // Extract video IDs
    const videoIds = searchResponse.data.items.map(item => item.id?.videoId);

    // Get detailed video information including statistics

    const filteredVideoIds = videoIds.filter((id): id is string => id !== null && id !== undefined);

    const videosConfig = {
        part: ['snippet', 'statistics', 'status', 'contentDetails'],
        id: filteredVideoIds, // Now filtered to only include strings
    };

    const videosResponse = await youtube.videos.list(videosConfig) as any;

    videosResponse.data.items.forEach((video: any) => {
        video.duration = convert_ISO_8601_to_seconds(video.contentDetails.duration)
        video.type = video.duration > 60 ? 'video' : 'short'
    })

    // Merge the data
    return {
        ...searchResponse.data,
        items: videosResponse.data.items
    };
};

const getPlaylists = async (youtube: youtube_v3.Youtube, maxResults = 10, pageToken: string) => {
    const response = await youtube.playlists.list({
        part: ['snippet', 'statistics'],
        mine: true,
        maxResults,
        pageToken,
    });
    return response.data;
};

const getChannelStatsByDate = async (youtube: youtube_v3.Youtube, auth: OAuth2Client, startDate: string, endDate: string) => {
    // Get channel analytics data
    const analytics = google.youtubeAnalytics({
        version: 'v2',
        auth,
        key: process.env.youtube_api_key, // API key for identity
    });

    const response = await analytics.reports.query({
        dimensions: 'day',
        metrics: [
            'views',
            'estimatedMinutesWatched',
            'averageViewDuration',
            'subscribersGained',
            'subscribersLost',
            'likes',
            'comments'
        ].join(','),
        startDate,
        endDate,
        ids: 'channel==MINE'
    });

    // Get channel details for the total subscriber count
    const channelResponse = await youtube.channels.list({
        part: ['statistics'],
        mine: true
    });

    return {
        endDate,
        dailyStats: response.data.rows || [],
        metrics: response.data.columnHeaders?.map(header => header.name) || [],
        totalSubscribers: channelResponse.data.items?.[0]?.statistics?.subscriberCount || 0
    };
};

const getAllYouTubeVideos = async (user: User) => {
    const allVideos = []
    const token = user.yt_act
    if (!token) {
        throw { status: 401, message: "User Not Found" }
    }
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    const youtube = google.youtube({
        version: 'v3',
        auth, // OAuth2 client
        key: process.env.youtube_api_key, // API key for identity
    });

    // const channels = await getChannel(youtube)
    // const resp = await getChannelStatsByDate(youtube, auth, '2020-01-01', '2024-11-27')
    let pagingToken = '1'
    while (pagingToken) {
        const videos = await getVideos(youtube, 100, pagingToken)
        allVideos.push(...videos.items)
        if (videos.nextPageToken) {
            pagingToken = videos.nextPageToken
        }
        else {
            pagingToken = ''
        }
    }

    // await fs.writeFileSync('./youtube.json', JSON.stringify(allVideos.filter(i => i.status.privacyStatus === 'public')), { encoding: 'utf-8' })

    return allVideos.filter(i => i.status.privacyStatus === 'public')
}
const app = require('express').Router()
const { getConfig } = require('../config/getConfig')
const { signJWT, validateJWT } = require('../middlewares/jwt')
const config = getConfig()

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library')

const getChannel = async (youtube,) => {
    const response = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true
    });
    return response.data;
};

const getVideos = async (youtube, maxResults = 10, pageToken) => {
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

    console.time('getStatistics')
    // Extract video IDs
    const videoIds = searchResponse.data.items.map(item => item.id.videoId);

    // Get detailed video information including statistics
    const videosResponse = await youtube.videos.list({
        part: ['snippet', 'statistics', /*'contentDetails'*/],
        id: videoIds
    });

    // Merge the data
    return {
        ...searchResponse.data,
        items: videosResponse.data.items
    };
};

const getPlaylists = async (youtube, maxResults = 10, pageToken) => {
    const response = await youtube.playlists.list({
        part: ['snippet', 'statistics'],
        mine: true,
        maxResults,
        pageToken,
    });
    return response.data;
};

const getChannelStatsByDate = async (youtube, auth, startDate, endDate) => {
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

app.get('/videos', validateJWT, async (req, res) => {
    try {
        const allVideos = []
        const user = req.userData
        const token = user.yt_act
        if (!token) {
            return res.sendStatus(401)
        }
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: token });
        const youtube = google.youtube({
            version: 'v3',
            auth, // OAuth2 client
            key: process.env.youtube_api_key, // API key for identity
        });

        // const channels = await getChannel(youtube)
        const resp = await getChannelStatsByDate(youtube, auth, '2020-01-01', '2024-11-27')
        let pagingToken = 1
        while (pagingToken) {
            const videos = await getVideos(youtube, 100, pagingToken)
            allVideos.push(...videos.items)
            if (videos.nextPageToken) {
                pagingToken = videos.nextPageToken
            }
            else {
                pagingToken = false
            }
        }

        return res.json(allVideos)
    } catch (err) {
        debugger
    }
})


module.exports = app 
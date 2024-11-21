const videos = require('./videos')

const config = {
    ultra_short: 3,
    mega_short: 5,
    very_short: 10,
    short_videos: 30,
    mid_videos: 60,
    long_videos: 120,
    very_long_videos: 180,
    mega_long_videos: 181
}

const ranges_names = {
    ultra_short: '0s-3s',
    mega_short: '4s-5s',
    very_short: '6-10s',
    short_videos: '11s-30s',
    mid_videos: '31s-60s',
    long_videos: '61s-120s',
    very_long_videos: '121s-180s',
    mega_long_videos: '181s+'
}

const map = {
    ultra_short: { videos: [] },
    mega_short: { videos: [] },
    very_short: { videos: [] },
    short_videos: { videos: [] },
    mid_videos: { videos: [] },
    long_videos: { videos: [] },
    very_long_videos: { videos: [] },
    mega_long_videos: { videos: [] },
}

for (let video of videos) {
    if (video.duration) {
        // Classification
        if (video.duration <= config.ultra_short) {
            map.ultra_short.videos.push(video)
        }
        if (config.ultra_short < video.duration && video.duration <= config.mega_short) {
            map.mega_short.videos.push(video)
        }
        if (config.mega_short < video.duration && video.duration <= config.very_short) {
            map.very_short.videos.push(video)
        }
        if (config.very_short < video.duration && video.duration <= config.short_videos) {
            map.short_videos.videos.push(video)
        }
        if (config.short_videos < video.duration && video.duration <= config.mid_videos) {
            map.mid_videos.videos.push(video)
        }
        if (config.mid_videos < video.duration && video.duration <= config.long_videos) {
            map.long_videos.videos.push(video)
        }
        if (config.long_videos < video.duration && video.duration <= config.very_long_videos) {
            map.very_long_videos.videos.push(video)
        }
        if (video.duration >= config.mega_long_videos) {
            map.mega_long_videos.videos.push(video)
        }

        // Averages VPD
        const view_per_duration = video.view_count / video.duration
        video.view_per_duration = view_per_duration
    }
    else {
        console.log("NO DURATION", video.title)
        video.view_per_duration = 0
    }
}

console.log("_____________________________________________________________________________________")


Object.keys(map).forEach(range => {
    if (map[range].videos.length) {
        const rangeAverageViews = map[range].videos.reduce((a, v) => a += v.view_count, 0) / map[range].videos.length
        map[range].average = Math.floor(rangeAverageViews)
    }
    else {
        map[range].average = 0
    }
})

Object.keys(ranges_names).forEach(range => {
    console.log(`Videos between ${ranges_names[range]}: ${map[range].videos.length} | Average Performance: ${map[range].average}`)
})


const sortedVideos = videos.sort((a, b) => b.view_per_duration - a.view_per_duration)


const top5Videos = sortedVideos.slice(0, 5)
const top5VideosLengths = top5Videos.map(i => i.duration)
const top5VideosLengthsAverage = top5VideosLengths.reduce((a, v) => a += v, 0) / top5VideosLengths.length
// Averages VPD


// TOTALS & AVERAGES
const totalViews = videos.reduce((a, v) => a += v.view_count, 0)
const averageViews = totalViews / videos.length
const totalComments = videos.reduce((a, v) => a += v.comment_count, 0)
const averageComments = totalComments / videos.length
const totalLikes = videos.reduce((a, v) => a += v.like_count, 0)
const averageLikes = totalLikes / videos.length

const threshold = 0.6 // 60%
const overTheThreshold_videos_views = videos.filter(i => i.view_count > (totalViews * threshold)).sort((a, b) => b.view_count - a.view_count)
const overTheThreshold_videos_likes = videos.filter(i => i.like_count > (totalLikes * threshold)).sort((a, b) => b.like_count - a.like_count)
const overTheThreshold_videos_comments = videos.filter(i => i.comment_count > (totalComments * threshold)).sort((a, b) => b.like_count - a.like_count)

const aboveAverage_videos_views = videos.filter(i => i.view_count > averageViews).sort((a, b) => b.view_count - a.view_count)
const aboveAverage_videos_likes = videos.filter(i => i.like_count > averageLikes).sort((a, b) => b.like_count - a.like_count)
const aboveAverage_videos_comments = videos.filter(i => i.comment_count > averageComments).sort((a, b) => b.like_count - a.like_count)
// TOTALS & AVERAGES
debugger
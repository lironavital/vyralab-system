import { TikTokPost, User, YouTubeVideo } from "../types/global";
import convert_ISO_8601_to_seconds from "./convert_ISO_8601";

export type Video = {
    user_id: string;
    video_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    platform: string;
    created_at: string;
    duration: number;
    comments: number;
    likes: number;
    dislikes: number;
    shares: number;
    views: number;
    saves: number;
}

function formatYouTubeVideos(youtubeVideos: Array<YouTubeVideo>, user: User): Array<Video> {
    const formattedVideos = youtubeVideos.map((video: YouTubeVideo) => {
        return {
            user_id: user.id,
            video_id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail_url: video.snippet.thumbnails?.standard ? video.snippet.thumbnails.standard.url : video.snippet.thumbnails.default.url,
            platform: "youtube",
            created_at: video.snippet.publishedAt,
            duration: convert_ISO_8601_to_seconds(video.contentDetails.duration),
            comments: +video.statistics.commentCount,
            likes: +video.statistics.likeCount,
            dislikes: video?.statistics?.dislikeCount ? +video.statistics.dislikeCount : 0,
            shares: 0,
            views: +video.statistics.viewCount,
            saves: +video.statistics.favoriteCount,
        }
    })
    return formattedVideos
}

function formatTikTokVideos(tiktokVideos: Array<TikTokPost>, user: User): Array<Video> {
    const formattedVideos = tiktokVideos.map((video: TikTokPost) => {
        return {
            user_id: user.id,
            video_id: video.id,
            title: video.title,
            description: video.video_description,
            thumbnail_url: video.cover_image_url,
            platform: "tiktok",
            created_at: new Date(video.create_time).toUTCString(),
            duration: video.duration,
            comments: +video.comment_count,
            likes: +video.like_count,
            dislikes: 0,
            shares: +video.share_count,
            views: +video.view_count,
            saves: 0,
        }
    })
    return formattedVideos
}

export { formatYouTubeVideos, formatTikTokVideos }
export type User = {
  id: string;
  email: string;
  password: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
  firstname: string;
  lastname: string;
  fb_act: string;
  fb_act_expire: string;
  tt_refresh_token: string;
  tt_act: string;
  tt_act_expire: string;
  yt_act: string;
  yt_act_expire: string;
  yt_refresh_token: string;
};

export type decodedTokenData = {
  id: number;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}

export type Video = {
  user_id: string; // Primary key
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  platform: string;
  created_at: string; // Assuming ISO 8601 formatted date string
  duration: number; // Integer type
  comments: number; // Integer type
  likes: number; // Integer type
  dislikes: number; // Integer type
  shares: number; // Integer type
  views: number; // Integer type
  saves: number; // Integer type
};

export type YouTubeVideo = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      standard?: {
        url: string;
        width: number;
        height: number;
      };
      maxres?: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
    defaultAudioLanguage?: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    contentRating: Record<string, unknown>;
    projection: string;
    hasCustomThumbnail: boolean;
  };
  status: {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
    madeForKids: boolean;
    selfDeclaredMadeForKids: boolean;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount?: string;
    favoriteCount: string;
    commentCount: string;
  };
  duration: number;
  type: string;
};

export type TikTokPost = {
  comment_count: number;
  cover_image_url: string;
  create_time: number; // Unix timestamp
  duration: number;
  height: number;
  id: string; // Unique identifier
  like_count: number;
  share_count: number;
  title: string;
  video_description: string;
  view_count: number;
  width: number;
};


declare global {
  namespace Express {
    interface Request {
      userData?: User
    }
  }
}
export { }; // Ensure this is treated as a module
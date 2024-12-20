import { Pool } from 'pg';
import { User, Video } from '../types/global';

const pool = new Pool({
    user: 'lironavital',
    host: 'localhost',
    database: 'vyralab',
    password: '111',
    port: 5432, // Default PostgreSQL port
});


(async () => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        console.log(result.rows);
    } catch (err: any) {
        console.error('Error executing query', err.message);
    }
})();

async function getUserById(userID: number) {
    const result = await pool.query(`SELECT * FROM users WHERE id=${userID};`);
    return result.rows[0];
}

async function getUserByEmailAndPassword({ email, password }: { email: string, password: string }) {
    const result = await pool.query(`SELECT * FROM users WHERE email='${email}' AND password_hash='${password}';`);
    return result.rows[0];
}

async function addUser(user: User) {
    const query = `INSERT INTO users (name, email, password_hash) VALUES ('${user.firstname}','${user.lastname}', '${user.email}', '${user.password}');`
    const result = await pool.query(query);
    return result.rows[0];
}

async function updateUser(userID: string, updatedFields: Partial<{ fb_act: string | null, fb_act_expire: string | null, tt_act: string | null, tt_act_expire: string | null, yt_act: string | null, yt_act_expire: string | null, [key: string]: any; }>) {
    const changingString = Object.keys(updatedFields).map((field: string) => {
        if (typeof updatedFields[field] === 'string') {
            return `${field}='${updatedFields[field]}'`
        }
        else {
            return `${field}=${updatedFields[field]}`
        }
    }).join(",\n")

    const query = `UPDATE users
    SET ${changingString}
    WHERE id=${userID};`

    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        debugger
        return false
    }
}

async function addVideoArray(videos: Array<Video>) {
    try {
        for (const vid of videos) {
            await addVideo(vid)
        }
        return true
    } catch (error: any) {
        console.log(error.message)
        return false
    }
}
async function addVideo(video: Video) {
    const keys = [
        "user_id",
        "video_id",
        "title",
        "description",
        "thumbnail_url",
        "platform",
        "created_at",
        "duration",
        "comments",
        "likes",
        "dislikes",
        "shares",
        "views",
        "saves",
    ] as (keyof Video)[];
    const values = keys.map((key) => video[key]);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(',');

    // Dynamically create the update clause for upsert
    const updateClause = keys.map(key => `${key} = EXCLUDED.${key}`).join(', ');

    // Assuming the conflict target is "video_id"
    const query = `
        INSERT INTO videos (${keys.join(',')})
        VALUES (${placeholders})
        ON CONFLICT (video_id) DO UPDATE
        SET ${updateClause}
        RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getVideosByUserAndPlatform(userID: string, platform: string) {
    const query = `SELECT * FROM videos WHERE user_id='${userID}' AND platform='${platform}' ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
}

async function getDataFreshnessByUserAndPlatform(userID: string, platform: string) {
    const result = await pool.query(`SELECT * FROM data_freshness WHERE user_id='${userID}' AND platform='${platform}';`);
    if (result.rows[0]) {
        return result.rows[0];
    }
    else {
        return { data_freshness: false }
    }
}

async function setDataFreshnessByUserAndPlatform(userID: string, platform: string) {
    const timeNow = new Date().toISOString().slice(0, 19).replace('T', ' ')
    // const query = `INSERT INTO data_freshness (user_id, platform, data_freshness) VALUES (${userID},'${platform}', '${timeNow}');`
    const query = `INSERT INTO data_freshness (user_id, platform, data_freshness) VALUES (${userID},'${platform}', '${timeNow}')
    ON CONFLICT (user_id) DO UPDATE
    SET user_id = EXCLUDED.user_id, platform = EXCLUDED.platform, data_freshness = EXCLUDED.data_freshness
    RETURNING *;`
    const result = await pool.query(query);
    return result.rows[0];
}

export { getUserById, addUser, updateUser, getUserByEmailAndPassword, addVideo, addVideoArray, getDataFreshnessByUserAndPlatform, setDataFreshnessByUserAndPlatform, getVideosByUserAndPlatform };
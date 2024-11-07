const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path')
const keypath = path.join(__dirname, '..', 'creds', 'hls-links-bigquery.json')
// Create a new instance of the BigQuery client
const bigquery = new BigQuery({ keyFilename: keypath });
const datefns = require('date-fns')

// Function to retrieve all data from `hls-links.link_clicks.link_clicks`
async function retrieveData() {
    const query = `SELECT * FROM \`hls-links.link_clicks.link_clicks\``;
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    return rows;
}

async function insert_click(data) {
    const table = bigquery.dataset('link_clicks').table('link_clicks');
    const datetime = new Date();
    const timestamp = datefns.format(datetime, 'yyyy-MM-dd HH:mm:ss');
    data.timestamp = timestamp
    const [apiResponse] = await table.insert(data);
    return apiResponse;


    // const query = `
    // INSERT INTO \`hls-links.link_clicks.link_clicks\` (link,timestamp,user_agent,origin)
    // VALUES ('${data.link}','${timestamp}','${data.user_agent}','${data.origin}')`;

    // const [job] = await bigquery.createQueryJob({ query });
    // const [rows] = await job.getQueryResults();
    // return rows;
}

async function insert_visitor(data) {
    const table = bigquery.dataset('visitors').table('visitors');
    const datetime = new Date();
    const timestamp = datefns.format(datetime, 'yyyy-MM-dd HH:mm:ss');
    data.timestamp = timestamp
    const [apiResponse] = await table.insert(data);
    return apiResponse;
}

async function insert_pre_save(data, song_name) {
    const table = bigquery.dataset('pre_saves').table(song_name);
    const datetime = new Date();
    const timestamp = datefns.format(datetime, 'yyyy-MM-dd HH:mm:ss');
    data.timestamp = timestamp
    const [apiResponse] = await table.insert(data);
    return apiResponse;
}

async function insert_event(data) {
    const table = bigquery.dataset('events').table('events');
    const datetime = new Date();
    const timestamp = datefns.format(datetime, 'yyyy-MM-dd HH:mm:ss');
    data.timestamp = timestamp
    const [apiResponse] = await table.insert(data);
    return apiResponse;
}

async function insert_nowListening(data) {
    const table = bigquery.dataset('now_listening').table('nowlistening');
    const [apiResponse] = await table.insert(data)
    return apiResponse;
}

async function getMinMaxListenersDaily(startDate) {
    const endDate = datefns.format(datefns.subDays(new Date(startDate), 30), 'yyyy-MM-dd')
    const query = `SELECT DATE(timestamp) AS date, MAX(listeners) AS max_listeners, MIN(listeners) AS min_listeners, ROUND(AVG(listeners)) as average FROM \`hls-links.now_listening.nowlistening\`
    WHERE DATE(timestamp) >= "${endDate}" AND DATE(timestamp)<= "${startDate}"
    GROUP BY date
    ORDER BY date`;
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    rows.forEach(i => i.date = i.date.value)
    return rows;
}
async function getListenersDaily(day) {
    const endDate = datefns.format(datefns.addDays(new Date(day), 1), 'yyyy-MM-dd')
    const query = `SELECT timestamp, listeners FROM \`hls-links.now_listening.nowlistening\`
    WHERE DATE(timestamp) >= "${day}" AND DATE(timestamp) < "${endDate}"
    ORDER BY timestamp ASC`;
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    rows.forEach(i => i.timestamp = i.timestamp.value)
    return rows;
}
async function getCurrentDailySpotifyDataInBQ() {
    const query = `SELECT date FROM \`hls-links.now_listening.spotify_data\`
    WHERE DATE(date) >= "2024-01-01" AND DATE(date) < "2030-01-01"
    ORDER BY date desc`;
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    rows.forEach(i => i.date = i.date.value.split('T')[0])
    return rows.map(i => i.date);
}
async function getDailySpotifyDataInBQ() {
    const query = `SELECT * FROM \`hls-links.now_listening.spotify_data\`
    WHERE DATE(date) >= "2024-01-01" AND DATE(date) < "2030-01-01"
    ORDER BY date desc`;
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    rows.forEach(i => i.date = i.date.value.split('T')[0])
    return rows;
}
async function insert_dailySpotifyData(data) {
    const table = bigquery.dataset('now_listening').table('spotify_data');
    const [apiResponse] = await table.insert(data)
    return apiResponse;
}



module.exports = { insert_click, insert_visitor, insert_pre_save, insert_event, insert_nowListening, getMinMaxListenersDaily, getListenersDaily, getCurrentDailySpotifyDataInBQ, insert_dailySpotifyData, getDailySpotifyDataInBQ }
const pixel_id = "992668358394150"
const access_token = 'EAAwZCzWtVtLgBACWwMGC3BdC8PCz5sAl1UEVBlsQ9YqyHu6Oa4KezSw3TCIZAMZBv4ZCNI2T5hNZAn9gIrgiihkckq5Xu4xlX5B2tCxmb6OpNTwUsiPaXoghxSsFS0dEjO5mBQe3qpOQVrsDZAqgODGrY34VlqdMpnexr0FqCZCkBZBVsUpXmWLZCHH8hCJ1YMZCUZD';

const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

async function facebookPixelSender({ req, pixel_id, access_token, song_name, origin }) {
    const newDate = new Date()
    const eventTime = Math.floor(newDate / 1000)
    const eventTime_13 = Math.floor(newDate)

    const ip = req.headers.ip
    const ua = req.headers['user-agent']
    const fbc = `fb.1.${eventTime}.${req.query.fbclid}` // fb.${subdomain_index}.${creation_time}.${fbclid}
    const fbp = `fb.1.${eventTime_13}.${Math.ceil(Math.random() * 9999999999)}` // fb.${subdomain_index}.${creation_time}.${random_number}

    const api = bizSdk.FacebookAdsApi.init(access_token);
    const userData = (new UserData())
        .setClientIpAddress(ip)
        .setClientUserAgent(ua)
        .setCountry(req.headers['country_short'])
        // .setState()
        // .setCity(redisData.vino_city.replace(/' '/g, '').toLowerCase())
        // .setZip(geoObj.zipCode)
        .setFbc(fbc)
        .setFbp(fbp)
        .setClientIpAddress(req.headers['ip'])

    const content = (new Content())
    // .setId(origin)
    // .setTitle(song_name)
    // .setQuantity(1)
    // .setDeliveryCategory(DeliveryCategory.HOME_DELIVERY);

    const customData = (new CustomData())
        // .setContents([content])
        .setCustomProperties({
            "song_name": song_name,
            "origin": origin
        })

    const serverEvent = (new ServerEvent())
        .setEventName('Link Click')
        .setEventTime(eventTime)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl(req.originalUrl)
        .setActionSource('website');

    const eventsData = [serverEvent];

    const eventRequest = (new EventRequest(access_token, pixel_id))
        // .setTestEventCode('TEST38895')
        .setEvents(eventsData);

    try {
        const facebookResp = await eventRequest.execute()
        console.log(facebookResp)
    } catch (err) {
        console.log(err)
    }
}

module.exports = { facebookPixelSender }
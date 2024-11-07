const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../creds/hls-links-firebase-adminsdk-c3ei4-f5f9c13090.json');
const uuid = require('uuid')

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function addLink(data) {
    const id = data.id
    await db.collection('links').doc(id).set(data);
    return id
}

async function editLink(data) {
    return await db.collection('links').doc(data.id).set(data);
}

async function removeLinks(ids) {
    const removedLinks = []
    try {
        for (id of ids) {
            await db.collection('links').doc(id).delete()
        }
        return removedLinks
    } catch (error) {
        console.log(error)
        return removedLinks
    }
}

async function getLinks() {
    const links = []
    const linkRaw = await db.collection('links').get()
    linkRaw.forEach((doc) => { links.push(doc.data()) })
    return links
}

async function addHomepageConfig(data) {
    const id = data.id
    await db.collection('homepageConfigs').doc(id).set(data);
    return id
}

async function editHomepageConfig(data) {
    return await db.collection('homepageConfigs').doc(data.id).set(data);
}

async function removeHomepageConfigs(ids) {
    const removedHomepageConfigs = []
    try {
        for (id of ids) {
            await db.collection('homepageConfigs').doc(id).delete()
        }
        return removedHomepageConfigs
    } catch (error) {
        console.log(error)
        return removedHomepageConfigs
    }
}

async function getHomepageConfigs() {
    const homepageConfigs = []
    const homepageConfigRaw = await db.collection('homepageConfigs').get()
    homepageConfigRaw.forEach((doc) => { homepageConfigs.push(doc.data()) })
    return homepageConfigs
}

module.exports = {
    addLink, editLink, removeLinks, getLinks, addHomepageConfig, editHomepageConfig, removeHomepageConfigs, getHomepageConfigs,
}


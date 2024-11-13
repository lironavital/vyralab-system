
// localDB.js

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Load data from db.json file
function loadData() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return an empty array
        return [];
    }
}

// Save data to db.json file
function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize db with data from file
let db = loadData();

function getUserById(userID) {
    return db.find(user => user.userID === userID);
}

function getUserByUsernameAndPassword({ username, password }) {
    return db.find(i => i.password === password && i.username === username)
}

function addUser(user) {
    db.push(user);
    saveData(db);  // Save changes to file
}

function updateUser(userID, updatedFields) {
    const user = getUserById(userID);
    if (user) {
        Object.assign(user, updatedFields);
        saveData(db);  // Save changes to file
        return true; // Update successful
    }
    return false; // User not found
}

function deleteUser(userID) {
    const index = db.findIndex(user => user.userID === userID);
    if (index !== -1) {
        db.splice(index, 1);
        saveData(db);  // Save changes to file
        return true; // Delete successful
    }
    return false; // User not found
}

module.exports = { db, getUserById, addUser, updateUser, deleteUser, getUserByUsernameAndPassword };
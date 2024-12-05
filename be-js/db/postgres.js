const { Pool } = require('pg');
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
    } catch (err) {
        console.error('Error executing query', err.message);
    }
})();

async function getUserById(userID) {
    const result = await pool.query(`SELECT * FROM users WHERE id=${userID};`);
    return result.rows[0];
}

async function getUserByEmailAndPassword({ email, password }) {
    const result = await pool.query(`SELECT * FROM users WHERE email='${email}' AND password_hash='${password}';`);
    return result.rows[0];
}

async function addUser(user) {
    const query = `INSERT INTO users (name, email, password_hash) VALUES ('${user.firstName}','${user.lastName}', '${user.email}', '${user.password}');`
    const result = await pool.query(query);
    return result.rows[0];
}

async function updateUser(userID, updatedFields) {
    const changingString = Object.keys(updatedFields).map(field => {
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

module.exports = { getUserById, addUser, updateUser, getUserByEmailAndPassword };
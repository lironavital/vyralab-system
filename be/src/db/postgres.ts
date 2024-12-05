import { Pool } from 'pg';
import { User } from '../types/global';

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

async function updateUser(userID: number, updatedFields: Partial<{ fb_act: string | null, fb_act_expire: string | null, tt_act: string | null, tt_act_expire: string | null, yt_act: string | null, yt_act_expire: string | null, [key: string]: any; }>) {
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

export { getUserById, addUser, updateUser, getUserByEmailAndPassword };
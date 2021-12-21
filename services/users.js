const db = require('./db');
const auth = require('./auth');

async function createUser(email, password, is_admin) {
    const hash = await auth.bcrypt.hash(password, await auth.bcrypt.genSalt(auth.saltRounds))
    return db
        .query(
            'INSERT INTO ' +
            'users(email, password, created_at, is_admin) ' +
            'VALUES ($1, $2, now(), $3) ' +
            'RETURNING *;',
            [email, hash, is_admin]);
}

async function getUser(email) {
    return db.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );
}

module.exports = {
    createUser,
    getUser
}
const db = require('./db');
const auth = require('./auth');

async function createUser(email, password, is_admin) {
    let user = undefined;
    auth.bcrypt.hash(password, auth.saltRounds, function (err, hash) {
        user = db
        .query(
            'INSERT INTO' +
            'users(email, password, created_at, is_admin)' +
            'VALUES ($1, $2, now(), $3)' +
            'RETURNING email, password, created_at, is_admin;', 
            [email, hash, is_admin])
        .catch(err => console.error('Error executing query', err.stack))
    })

    return user;
}

async function getUser(email) {
    return db.query(
        'SELECT password FROM users WHERE email = $1', [email]
    );
}

module.exports = {
    createUser,
    getUser
}
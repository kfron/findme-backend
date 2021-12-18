const db = require('./db');
const auth = require('./auth');

async function createUser(email, password, is_admin) {
    auth.bcrypt.hash(password, auth.saltRounds, function (err, hash) {
        db
        .query(
            'INSERT INTO users(email, password, created_at, is_admin) VALUES ($1, $2, now(), $3);', 
            [email, hash, is_admin])
        .catch(err => console.error('Error executing query', err.stack))
    })
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
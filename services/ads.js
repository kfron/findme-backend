const db = require('./db');

async function getAdsList() {
    const data = await db.query(
        'SELECT * FROM ads;'
    );

    return data;
}

async function getAd(id) {
    const data = await db.query(
        'SELECT * FROM ads WHERE id = $1;',[id]
    );

    return data;
}

async function createAd(userId, name, age, image, description) {
    const data = await db.query(
        'INSERT INTO ' +
        'ads(user_id, name, age, image, description) ' +
        'VALUES ($1, $2, $3, $4, $5) ' +
        'RETURNING *;', 
        [userId, name, age, image, description]
    );

    return data;
}

module.exports = {
    getAdsList,
    getAd,
    createAd
}
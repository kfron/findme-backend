const db = require('./db');

async function getAdsList(lat, lon, dist) {
    const data = await db.query(
        `
        WITH newest_closest AS(
            SELECT DISTINCT ON (ad_id) ad_id, found_at, lat, lon
            FROM findings
            WHERE (point(lat, lon) <-> point($1, $2)) < $3
            ORDER BY ad_id, found_at DESC)
        SELECT a.*, n.found_at, n.lat, n.lon
            FROM ads a
            JOIN newest_closest n
            ON a.id = n.ad_id;
        `,
        [lat, lon, dist]
    );

    return data;
}

async function getAd(id) {
    const data = await db.query(
        'SELECT * FROM ads WHERE id = $1;', [id]
    );

    return data;
}

async function createAd(userId, name, age, image, description, lat, lon) {
    const adData = await db.query(
        `
        INSERT INTO
            ads(user_id, name, age, image, description)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [userId, name, age, image, description]
    );

    const findingData = await db.query(
        `
        INSERT INTO
            findings(ad_id, found_at, lat, lon)
        VALUES
            ($1, now(), $2, $3)
        `,
        [adData[0].id, lat, lon]
    )
    return adData;
}

async function updateAd(id, name, age, image, description) {
    const data = await db.query(
        'UPDATE ads SET ' +
        'name = $1, ' +
        'age = $2, ' +
        'image = $3, ' +
        'description = $4 ' +
        'WHERE id = $5;',
        [name, age, image, description, id]
    );
    return data;
}

async function deleteAd(id) {
    const data = await db.query(
        'DELETE FROM ads ' +
        'WHERE id = $1;',
        [id]
    );

    return data;
}

module.exports = {
    getAdsList,
    getAd,
    createAd,
    updateAd,
    deleteAd
}
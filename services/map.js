const db = require('./db');

async function getClosestTo(lat, lon, dist) {
    const data = await db.query(
        `
        SELECT f.*, a.name, a.image, a.user_id, a.age
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
        WHERE calculate_distance(lat, lon, $1, $2, 'K') < $3
        AND next_id IS NULL 
        ORDER BY calculate_distance(lat, lon, $1, $2, 'K')
        `,
        [lat, lon, dist]
    );

    return data;
}

async function getPath(startId) {
    const data = await db.query(
        `
        WITH RECURSIVE path AS (
            SELECT *
                FROM findings WHERE id = $1
            UNION
            SELECT f.*
                FROM findings f
            JOIN path p ON p.prev_id = f.id)
        SELECT * FROM path ORDER BY found_at;
        `,
        [startId]
    );

    return data;
}

async function createFinding(adId, lat, lon) {
    const prevId = (await db.query(
        `
        SELECT id 
        FROM findings 
        WHERE ad_id = $1 
        ORDER BY found_at DESC 
        LIMIT 1
        `,
        [adId]
    ))[0]?.id;
    const data = await db.query(
        `
        INSERT INTO
        findings(ad_id, found_at, prev_id, lat, lon)
        VALUES ($1, now(), $2, $3, $4)
        RETURNING *
        `,
        [adId, prevId, lat, lon]
    );
    return data;
}

module.exports = {
    getClosestTo,
    getPath,
    createFinding
}
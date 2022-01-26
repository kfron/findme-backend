const db = require('../configs/db');

async function getClosestTo(lat, lon, dist) {
	return await db.query(
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
}

async function getNewestFinding(adId) {
	return await db.query(
		`
		SELECT f.*, a.name, a.image, a.user_id, a.age
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
		WHERE f.ad_id = $1
		AND next_id IS NULL
		`,
		[adId]
	);
}

async function getPath(startId) {
	return await db.query(
		`
        WITH RECURSIVE path AS (
            SELECT *
                FROM findings WHERE id = $1
            UNION
            SELECT f.*
                FROM findings f
            JOIN path p ON p.prev_id = f.id)
        SELECT p.*, a.name, a.image, a.user_id, a.age 
		FROM path p
		JOIN ads a ON p.ad_id = a.id 
		ORDER BY p.found_at;
        `,
		[startId]
	);
}

async function createFinding(adId, userId, lat, lon) {
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
	
	return await db.query(
		`
        INSERT INTO
        findings(ad_id, found_at, prev_id, lat, lon, found_by_id)
        VALUES ($1, now(), $2, $3, $4, $5)
        `,
		[adId, prevId, lat, lon, userId]
	);
}

module.exports = {
	getClosestTo,
	getPath,
	createFinding,
	getNewestFinding
}
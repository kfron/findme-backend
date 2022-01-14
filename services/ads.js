const db = require('./db');

async function getAdsList(lat, lon, dist) {
	return await db.query(
		`
        SELECT a.*, f.found_at, f.lat, f.lon
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
        WHERE calculate_distance(lat, lon, $1, $2, 'K') < $3
        AND next_id IS NULL 
        ORDER BY calculate_distance(lat, lon, $1, $2, 'K')
        `,
		[lat, lon, dist]
	);
}

async function getAd(id) {
	return await db.query(
		`
		SELECT a.*, f.found_at, f.lat, f.lon
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
		WHERE a.id = $1;
		`, [id]
	);

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

	await db.query(
		`
        INSERT INTO
            findings(ad_id, found_at, lat, lon, found_by_id)
        VALUES
            ($1, now(), $2, $3, $4)
        `,
		[adData[0].id, lat, lon, userId]
	)
	return adData;
}

async function updateAd(id, name, age, image, description) {
	return await db.query(
		`
		UPDATE ads SET
			name = $1
			age = $2
			image = $3
			description = $4
		WHERE id = $5
		`,
		[name, age, image, description, id]
	);
}

async function deleteAd(id) {
	return await db.query(
		`
		DELETE FROM ads
		WHERE id = $1
		`,
		[id]
	);

}

async function getAdsOfUser(userId) {
	return await db.query(
		`
		SELECT a.*, f.found_at, f.lat, f.lon
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
        WHERE a.user_id = $1
		AND next_id IS NULL 
		`,
		[userId]
	)
}

async function getAdsPingedByUser(userId) {
	return await db.query(
		`
		SELECT a.*, f.found_at, f.lat, f.lon
        FROM findings f 
        JOIN ads a ON f.ad_id = a.id
        WHERE f.found_by_id = $1
		AND next_id IS NULL 
		`,
		[userId]
	)
}

module.exports = {
	getAdsList,
	getAd,
	createAd,
	updateAd,
	deleteAd,
	getAdsOfUser,
	getAdsPingedByUser
}
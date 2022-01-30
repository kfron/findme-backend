const express = require('express');
const router = express.Router();
const map = require('../services/map');

/**
 * Zapytanie o listę napotkań w określonej odległości od podanych koordynatów
 */
router.get('/getClosestTo', async function (req, res, next) {
	let lat = +req.query.lat;
	let lon = +req.query.lon;
	let dist = +req.query.dist;
	try {
		res.json(await map.getClosestTo(lat, lon, dist));
	} catch (err) {
		console.error(`Error while getting closest findings `, err.message);
		res.status(500).json({ message: err.message });
		return;
	}
});

/**
 * Zapytanie o listę napotkań tworzących ścieżkę w ramach jednego zgłoszenia
 */
router.get('/getPath', async function (req, res, next) {
	let startId = +req.query.startId;
	try {
		res.json(await map.getPath(startId));
	} catch (err) {
		console.error(`Error while getting getting a path `, err.message);
		res.status(500).json({ message: err.message });
		return;
	}
});

/**
 * Zapytanie o najnowsze napotkanie dla konkretnego zgłoszenia
 */
router.get('/getNewestFinding', async function (req, res, next) {
	let adId = +req.query.adId;
	try {
		res.json(await map.getNewestFinding(adId));
	} catch (err) {
		console.error(`Error while getting getting newest finding of an ad `, err.message);
		res.status(500).json({ message: err.message });
		return;
	}
});

/**
 * Żądanie stworzenia nowego napotkania dla konkretnego zgłoszenia
 */
router.post('/createFinding', async function (req, res, next) {
	let adId = +req.body.adId;
	let userId = +req.body.userId;
	let lat = +req.body.lat;
	let lon = +req.body.lon;

	try {
		await map.createFinding(adId, userId, lat, lon);
	} catch (err) {
		console.log("Error while creating a finding ", err.message);
		res.status(500).json({ message: err.message });
		return;
	}
	res.json({});
})

module.exports = router;

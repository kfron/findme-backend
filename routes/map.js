const express = require('express');
const router = express.Router();
const map = require('../services/map');

router.get('/getClosestTo', async function (req, res, next) {
	let lat = +req.query.lat;
	let lon = +req.query.lon;
	let dist = +req.query.dist;
	try {
		res.json(await map.getClosestTo(lat, lon, dist));
	} catch (err) {
		console.error(`Error while getting closest findings `, err.message);
		next(err);
	}
});

router.get('/getPath', async function (req, res, next) {
	let startId = +req.query.startId;
	try {
		res.json(await map.getPath(startId));
	} catch (err) {
		console.error(`Error while getting getting a path `, err.message);
		next(err);
	}
});

router.post('/createFinding', async function (req, res, next) {
	let adId = +req.body.adId;
	let lat = +req.body.lat;
	let lon = +req.body.lon;

	let result = null;
	try {
		result = (await map.createFinding(adId, lat, lon));
	} catch (err) {
		console.log("Error while creating a finding ", err.message);
		next(err);
	}
	res.json(result);
})

module.exports = router;

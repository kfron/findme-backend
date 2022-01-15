const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const ads = require('../services/ads');

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname + '-' + Date.now());
	}
});
const upload = multer({ storage: storage })

router.get('/getAdsList', async function (req, res, next) {
	let lat = +req.query.lat;
	let lon = +req.query.lon;
	let dist = +req.query.dist;
	try {
		res.json(await ads.getAdsList(lat, lon, dist));
	} catch (err) {
		console.error(`Error while getting ads `, err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/getAd', async function (req, res, next) {
	let id = +req.query.id;
	try {
		res.json((await ads.getAd(id))[0]);
	} catch (err) {
		console.error(`Error while getting ad `, err.message);
		res.status(500).json({ message: err.message });
	}
});

router.post('/createAd', upload.single('image'), async function (req, res, next) {
	if (!req.file) {
		res.status(500).json({ message: `Image didn't arrive.` });
	} else {
		let userId = req.body.userId;
		let name = req.body.name;
		let age = req.body.age;
		let image = req.file.filename;
		let description = req.body.description;
		let lat = req.body.lat;
		let lon = req.body.lon;
		let ad = null;
		try {
			ad = (await ads.createAd(userId, name, age, image, description, lat, lon));
		} catch (err) {
			console.log("Error while creating ad ", err.message);
			res.status(500).json({ message: err.message });
		}
		res.json(ad);
	}
});

router.put('/updateAd', upload.single('image'), async function (req, res, next) {
	let id = +req.body.id;
	let name = req.body.name;
	let age = +req.body.age;
	let image = null;
	let description = req.body.description;
	if (!!req.file) {
		try {
			let ad = (await ads.getAd(id))[0];
			let imagePath = './public/' + ad.image;
			fs.unlink(imagePath, (err) => {
				if (err) throw err;
			});
		} catch (err) {
			console.log("Error while getting ad ", err.message);
			res.status(500).json({ message: err.message });
		}
		image = req.file.filename;
	}

	try {
		await ads.updateAd(id, name, age, image, description);
	} catch (err) {
		console.log("Error while updating ad ", err.message);
		res.status(500).json({ message: err.message });
	}
	res.json({});
});

router.delete('/deleteAd', async function (req, res, next) {
	let id = +req.query.id;

	try {
		await ads.deleteAd(id);
	} catch (err) {
		console.log("Error while deleting ad ", err.message);
		res.status(500).json({ message: err.message });
	}

	res.json({});
})

router.get('/getMyAds', async function (req, res, next) {
	let userId = +req.query.id;

	try {
		res.json(await ads.getAdsOfUser(userId));
	} catch (err) {
		console.log("Error while getting user's ads ", err.message);
		res.status(500).json({ message: err.message });
	}
})

router.get('/getMyPings', async function (req, res, next) {
	let userId = +req.query.id;

	try {
		res.json(await ads.getAdsPingedByUser(userId));
	} catch (err) {
		console.log("Error while getting ads pinged by user ", err.message);
		res.status(500).json({ message: err.message });
	}
})

module.exports = router;

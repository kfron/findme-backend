const express = require('express');
const router = express.Router();
const ads = require('../services/ads');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads/');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
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
		next(err);
	}
});

router.get('/getAd', async function (req, res, next) {
	let id = +req.query.id;
	try {
		res.json(await ads.getAd(id));
	} catch (err) {
		console.error(`Error while getting ad `, err.message);
		next(err);
	}
});

router.post('/createAd', upload.single('image'), async function (req, res, next) {
	if (!req.file) {
		res.status(500).json({ message: `Image didn't arrive.` });
	} else {
		let userId = req.body.userId;
		let name = req.body.name;
		let age = req.body.age;
		let image = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=980:*';
		let description = req.body.description;
		let lat = req.body.lat;
		let lon = req.body.lon;
		let ad = null;
		try {
			ad = (await ads.createAd(userId, name, age, image, description, lat, lon));
		} catch (err) {
			console.log("Error while creating ad ", err.message);
			next(err);
		}
		res.json(ad);
	}
});

router.put('/updateAd', upload.single('image'), async function (req, res, next) {
	let id = req.body.id;
	let name = req.body.name;
	let age = req.body.age;
	let image = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=980:*';
	let description = req.body.description;
	try {
		await ads.updateAd(id, name, age, image, description);
	} catch (err) {
		console.log("Error while updating ad ", err.message);
		next(err);
	}
	res.json({});
});

router.delete('/deleteAd', async function (req, res, next) {
	let id = +req.query.id;

	try {
		await ads.deleteAd(id);
	} catch (err) {
		console.log("Error while deleting ad ", err.message);
		next(err);
	}

	res.json({});
})

router.get('/getMyAds', async function (req, res, next) {
	let userId = +req.query.id;

	try {
		res.json(await ads.getAdsOfUser(userId));
	} catch (err) {
		console.log("Error while getting user's ads ", err.message);
		next(err);
	}
})

router.get('/getMyPings', async function (req, res, next) {
	let userId = +req.query.id;

	try {
		res.json(await ads.getAdsPingedByUser(userId));
	} catch (err) {
		console.log("Error while getting ads pinged by user ", err.message);
		next(err);
	}
})

module.exports = router;

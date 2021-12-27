const express = require('express');
const router = express.Router();
const ads = require('../services/ads');
const multer = require('multer');
const { path } = require('../app');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

router.get('/getAdsList', async function (req, res, next) {
  try {
    res.json(await ads.getAdsList());
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

router.post('/createAd', upload.single('image'), function (req, res, next) {
  console.log('something received');
  console.log(req);
  /*let userId = req.body.userId;
  let name = req.body.name;
  let age = req.body.age;
  let image = req.body.image;
  let description = req.body.description;

  console.log(req.body);
*/
  console.log(req.file);
  console.log(req.body);
  let ad = null;
  /*try {
    ad = await ads.createAd(userId, name, age, image, description);
  } catch (err) {
    console.log('Error while creating ad ', err.message);
    next(err);
  }*/
  res.json(ad);
});

module.exports = router;

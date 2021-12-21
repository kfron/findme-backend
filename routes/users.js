const express = require('express');
const { bcrypt } = require('../services/auth');
const router = express.Router();
const users = require('../services/users');

router.post('/login', async function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let user = null

  try {
    user = (await users.getUser(email))[0];
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }

  if (!user) {
    res.json({ 'error': 'Incorrect email' })
  } else {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result == true) {
        res.json({ email: user.email, password: password, is_admin: user.is_admin })
      } else {
        res.json({ 'error': 'Incorrect password' })
      }
    })
  }
});

router.post('/signup', async function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let is_admin = req.body.is_admin;
  let user = null;

  let test = await users.getUser(email)
  if (test) {
    res.json({ 'error': 'Email address taken' })
  } else {
    try {
      user = (await users.createUser(email, password, is_admin));
    } catch (err) {
      console.log("Error while creating user", err.message);
      next(err);
    }
    res.json(user);
  }

})

module.exports = router;

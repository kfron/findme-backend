const express = require('express');
const { bcrypt } = require('../configs/auth');
const router = express.Router();
const users = require('../services/users');

router.post('/login', async function (req, res, next) {
	console.log(req.body);
	let email = req.body.email;
	let password = req.body.password;
	let user = null

	try {
		user = (await users.getUser(email))[0];
	} catch (err) {
		console.error(`Error while getting user `, err.message);
		res.status(500).json({ message: err.message })
		return;
	}

	if (!user) {
		res.status(500).json({ message: `User with this email doesn't exist.` })
		return;
	} else {
		bcrypt.compare(password, user.password, function (err, result) {
			if (result == true) {
				res.json(user);
				return;
			} else {
				res.status(500).json({ message: 'Incorrect password.' });
				return;
			}
		})
	}
});

router.post('/signup', async function (req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	let user = null;

	let exists = (await users.getUser(email))[0];
	if (exists) {
		res.status(500).json({ message: 'Email address already taken.' })
		return;
	} else {
		try {
			user = (await users.createUser(email, password));
		} catch (err) {
			console.log("Error while creating user", err.message);
			res.status(500).json({ message: err.message })
			return;
		}
		res.json(user);
		return;
	}

})

router.put('/changeEmail', async function (req, res, next) {
	let id = +req.body.id;
	let email = req.body.email;
	let user = null;

	let exists = (await users.getUser(email))[0];
	if (exists) {
		res.status(500).json({ message: 'Email address already taken.' })
		return;
	} else {
		try {
			user = (await users.changeEmail(id, email));
		} catch (err) {
			console.log("Error while changing email", err.message);
			res.status(500).json({ message: err.message })
			return;
		}
		res.json(user);
		return;
	}

})

router.put('/changePassword', async function (req, res, next) {
	let id = +req.body.id;
	let password = req.body.password;
	let user = null;

	try {
		user = (await users.changePassword(id, password));
	} catch (err) {
		console.log("Error while changing email", err.message);
		res.status(500).json({ message: err.message })
		return;
	}
	res.json(user);

})

module.exports = router;

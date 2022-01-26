const db = require('../configs/db');
const auth = require('../configs/auth');

async function createUser(email, password) {
	const hash = await auth.bcrypt.hash(password, await auth.bcrypt.genSalt(auth.saltRounds))
	return db
		.query(
			`
			INSERT INTO users(email, password, created_at)
			VALUES ($1, $2, now())
			RETURNING *
			`,
			[email, hash]);
}

async function getUser(email) {
	return db.query(
		`
		SELECT * FROM users WHERE email = $1
		`,
		[email]
	);
}

async function changeEmail(userId, email) {
	return db.query(
		`
		UPDATE users
		SET email = $2
		WHERE id = $1
		`,
		[userId, email]
	)
}

async function changePassword(userId, password) {
	const hash = await auth.bcrypt.hash(password, await auth.bcrypt.genSalt(auth.saltRounds));
	return db.query(
		`
		UPDATE users
		SET password = $2
		WHERE id = $1
		`,
		[userId, hash]
	)
}

module.exports = {
	createUser,
	getUser,
	changeEmail,
	changePassword
}
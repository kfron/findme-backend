const { Pool } = require('pg');
const config = require('../configs/config');
const pool = new Pool(config.db);

async function query(query, params) {
	const { rows, fields } = await pool.query(query, params);

	return rows;
}

module.exports = {
	query,
	pool
}
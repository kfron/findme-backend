const { Pool } = require('pg');
const config = require('../config');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

async function query(query, params) {
    const {rows, fields} = await pool.query(query, params);

    return rows;
}

module.exports = {
    query
}
require('dotenv').config()

const { Pool } = require('pg')
const { mysql } = require('mysql2')

let pool

if (process.env.NODE_ENV === 'production') {
    // Production environment
    pool = new Pool({
        connectionString: process.env.POSTGRESQL_DATABASE_URL
    })
} else {
    // Development environment
    pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    })
}

async function connect() {
    let client

    try {
        client = await pool.connect()
        console.log('Database connected successfully.')
        console.log('Running in environment:', process.env.NODE_ENV)
        client.query('SELECT NOW();', (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack)
            } else {
                console.log('Current time:', res.rows[0])
            }
            client.release()
        })
    } catch (error) {
        console.error('Failed to connect to database.', error)
    }
}

module.exports = { connect, pool }
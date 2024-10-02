const { Pool } = require('pg');
require('dotenv').config();

// Postgresql connection 
const dbServer = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,  // You can keep it false unless you're working in a highly secure environment.
    },
});

dbServer.connect((err) => {
    if (err) return console.log('error connecting to db: ', err);
    return console.log('Connected to database successfully: ');
})


module.exports = dbServer;
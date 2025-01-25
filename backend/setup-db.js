// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Initialize database connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,       // Database username
  host: process.env.DB_HOST,       // Database host (e.g., localhost)
  database: process.env.DB_NAME,   // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT,       // Database port (default: 5432)
});

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Read schema file
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Force drop and recreate services table
    await pool.query('DROP TABLE IF EXISTS services CASCADE');
    console.log('Dropped services table if it existed.');

    // Execute schema
    await pool.query(schemaSQL);
    console.log('Schema executed successfully');

    // Verify users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Current users count: ${usersResult.rows[0].count}`);

    // Verify services
    const servicesResult = await pool.query('SELECT COUNT(*) FROM services');
    console.log(`Current services count: ${servicesResult.rows[0].count}`);

    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Error setting up database:', err.message);
    process.exit(1);
  } finally {
    // Clean up the pool to avoid hanging processes
    await pool.end();
  }
}

// Call setupDatabase and handle any errors
setupDatabase().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});




import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
const pool = new Pool({
 host: process.env.DB_HOST || 'localhost',
 port: Number(process.env.DB_PORT || 5432),
 database: process.env.DB_NAME || 'placement_portal',
 user: process.env.DB_USER || 'placement_user',
 password: process.env.DB_PASSWORD || 'placement_lab_password'
});
export default pool;

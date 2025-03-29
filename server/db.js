import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 20000,
});

pool
	.connect()
	.then(() => console.log("Connected to NeonDB PostgreSQL"))
	.catch((err) => console.error("Connection error", err));

export default pool;


import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
	connection: {

		host: process.env.DB_HOST!,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_DATABASE!,
		port: Number(process.env.DB_PORT!) || 5432,
		// connectionString: process.env.DATABASE_URL!,
		ssl: process.env.NODE_ENV?.toLowerCase() === 'development' ? false : { rejectUnauthorized: false }
	}
});

import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/db/schema.ts',
	dbCredentials: {
		host: process.env.DB_HOST!,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_DATABASE!,
		port: Number(process.env.DB_PORT!) || 5432,
		// url: process.env.DATABASE_URL!,
		ssl: {
			rejectUnauthorized: false
		}
	},
});


import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	out: './drizzle',
	schema: './drizzle/schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		ssl: 'require'
	},
});


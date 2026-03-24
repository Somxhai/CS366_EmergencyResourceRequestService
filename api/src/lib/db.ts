
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import fs from "fs";
import path from "path";

const certPath = path.resolve(process.cwd(), 'cert/global-bundle.pem');
const ca = fs.readFileSync(certPath);
export const db = drizzle({
	connection: {

		host: process.env.DB_HOST!,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_DATABASE!,
		// connectionString: process.env.DATABASE_URL!,
		ssl: {
			ca: ca.toString(),
			rejectUnauthorized: false
		}
	}
});

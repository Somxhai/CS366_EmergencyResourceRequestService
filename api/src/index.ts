import { Elysia } from "elysia";
import { resource } from "./resource";
import { openapi } from '@elysiajs/openapi'
import { logger } from "@bogeychan/elysia-logger";

const app = new Elysia().use(openapi()).use(logger()).get("/health", () => "Hello, it's working").get("/public-outbound", async () => {
	try {
		const res = await fetch("https://api.ipify.org?format=json");
		const data = await res.json();
		return {
			success: true,
			data
		};
	} catch (err) {
		if (err instanceof Error)
			return {
				success: false,
				error: err.message
			};
	}

}).onError(({ code, error, set }) => {
	if (code === 'VALIDATION') {
		set.status = 400
		return {
			message: error.message,
			fields: error.all
		}
	}
}).use(resource).listen({
	port: process.env.PORT || 3000,
	hostname: "0.0.0.0"
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

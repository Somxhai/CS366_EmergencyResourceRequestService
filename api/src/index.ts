import { Elysia } from "elysia";
import { resource } from "./resource";
import { openapi } from '@elysiajs/openapi'

const app = new Elysia().use(openapi()).get("/health", () => "Hello, it's working").use(resource).listen({
	port: process.env.PORT || 3000,
	hostname: "0.0.0.0"
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

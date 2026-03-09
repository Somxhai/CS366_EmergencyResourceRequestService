import { Elysia } from "elysia";
import { resource } from "./resource";
import { openapi } from '@elysiajs/openapi'

const app = new Elysia().use(openapi({
	path: '/v1/openapi'
})).get("/health", () => "Hello, it's working").use(resource).listen(3000);


console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

import { Elysia } from "elysia";
import { resource } from "./resource";
import { openapi } from '@elysiajs/openapi'
import { logger } from "@bogeychan/elysia-logger";

const app = new Elysia().use(openapi()).use(logger({
	transport: {
		target: 'pino-pretty'
	}
})).resolve(({ headers }) => ({
	traceId: headers['x-trace-id'] ?? crypto.randomUUID()
}))
	.onAfterHandle(({ log, traceId, request, set }) => {
		log.info({
			traceId,
			method: request.method,
			path: new URL(request.url).pathname,
			status: set.status
		})
	}).mapResponse(({ responseValue: response, traceId }) => {
		if (response === undefined || response === null) return

		if (typeof response === 'object' && !(response instanceof Response)) {
			return new Response(
				JSON.stringify({ ...response, traceId }),
				{ headers: { 'content-type': 'application/json' } }
			)
		}

		return new Response(
			typeof response === 'string' ? response : JSON.stringify(response)
		)
	})
	// .onError(({ code, error, set, traceId, log }) => {
	// 		if (code === 'VALIDATION') {
	// 			set.status = 400
	// 			return {
	// 				traceId,
	// 				message: error.message,
	// 				fields: error.all
	// 			}
	// 		}
	// 		if (code === 'NOT_FOUND') {
	// 			set.status = 404
	// 			return {
	// 				traceId,
	// 				message: 'Route not found'
	// 			}
	// 		}
	// 		log!.error({ traceId, code, error: error }, 'Unhandled error')
	// 		set.status = 500
	// 		return {
	// 			traceId,
	// 			message: 'Internal server error'
	// 		}
	// 	})
	.get("/health", () => "Hello, it's working").get("/public-outbound", async () => {
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

	}).use(resource).listen({
		port: process.env.PORT || 3000,
		hostname: "0.0.0.0"
	});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

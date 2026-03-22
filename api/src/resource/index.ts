import { Elysia } from 'elysia'
import { Resource } from './service'
import { ResourceModel } from './model'
import { checkAndSetIdempotencyKey } from "../lib/idempotency"

export const resource = new Elysia({ prefix: '/v1/resource', tags: ['Resource'] })

	.post("/deprecated/", async ({ body, headers, status }) => {
		let idempotencyKey = headers['idempotency-key'];
		if (idempotencyKey) {
			const isNewRequest = await checkAndSetIdempotencyKey(idempotencyKey);

			if (!isNewRequest) {
				console.info(`Duplicate create resource request: ${idempotencyKey}`)
				return status(409, {
					message: "Duplicate request detected. This operation has already been processed or is currently processing."
				});
			}
		}
		return Resource.createRequest(body)
	}, {
		detail: {
			summary: "Create resource request",
			description: "Create a new resource request for an incident including requested items and location information."
		},

		body: ResourceModel.createRequestBody,
		headers: ResourceModel.createRequestHeaders,

		response: {
			201: ResourceModel.createRequestResponse201,
			400: ResourceModel.error,
			409: ResourceModel.error // Added 409 for idempotency rejection
		}
	})

	.post("/", async ({ body, headers, status }) => {
		let idempotencyKey = headers['idempotency-key'] as string | undefined;
		if (idempotencyKey) {
			const isNewRequest = await checkAndSetIdempotencyKey(idempotencyKey);

			if (!isNewRequest) {
				console.info(`Duplicate create resource request: ${idempotencyKey}`)
				return status(409, {
					message: "Duplicate request detected. This operation has already been processed or is currently processing."
				});
			}
		}
		return Resource.createRequestAsync(body)
	}, {
		detail: {
			summary: "Create resource request",
			description: "Create a new resource request for an incident including requested items and location information."
		},

		body: ResourceModel.createRequestBody,
		headers: ResourceModel.createRequestHeaders,
		response: {
			200: ResourceModel.createRequestAsyncResponse,
			400: ResourceModel.error,
			409: ResourceModel.error
		}
	})


	.get("/list-request", ({ query }) => {
		return Resource.listRequests(query)
	}, {
		detail: {
			summary: "List resource requests",
			description: "Retrieve resource requests filtered by incident ID, status, and priority."
		},

		query: ResourceModel.listRequestsQuery,
		headers: ResourceModel.listRequestsHeaders,

		response: {
			200: ResourceModel.listRequestsResponse200,
			404: ResourceModel.error
		}
	})

	.post("/:request_id/assign", async ({ params, body, headers, status }) => {
		// Read the key (cast as string if your model doesn't explicitly define it for this route yet)
		let idempotencyKey = headers['idempotency-key'] as string | undefined;
		if (idempotencyKey) {
			const isNewRequest = await checkAndSetIdempotencyKey(idempotencyKey);

			if (!isNewRequest) {
				console.info(`Duplicate assign team request: ${idempotencyKey}`)
				return status(409, {
					message: "Duplicate request detected. This operation has already been processed or is currently processing."
				});
			}
		}

		return Resource.assign_to({
			requestId: params.request_id,
			teamId: body.team_id
		})
	}, {
		detail: {
			summary: "Assign team to request",
			description: "Assign a response team to handle a specific resource request. Status will change to IN_PROGRESS."
		},

		params: ResourceModel.assignParams,
		body: ResourceModel.createAssignTeamBody,

		response: {
			201: ResourceModel.createAssignTeamResponse201,
			404: ResourceModel.error,
			409: ResourceModel.error // Added 409 for idempotency rejection
		}
	})

	.get("/:request_id", ({ params }) => {
		return Resource.getRequestById(params.request_id)
	}, {
		detail: {
			description: "Retrieve detailed information for a specific resource request.",
			summary: "Get resource request"
		},
		params: ResourceModel.getRequestParams,
		response: {
			200: ResourceModel.getRequestResponse200,
			404: ResourceModel.error
		}
	})

	.patch("/:request_id/close", ({ params }) => {
		return Resource.closeRequest(params.request_id)
	}, {
		detail: {
			summary: "Close resource request",
			description: "Mark a resource request as CLOSED after the assigned team completes the task."
		},

		params: ResourceModel.finishRequestParams,

		response: {
			200: ResourceModel.finishRequestResponse200
		}
	})

	.patch("/:request_id/unassign", ({ params }) => {
		return Resource.unassignRequest(params.request_id)
	}, {
		detail: {
			summary: "Unassign team",
			description: "Remove the assigned team from the request and reset the request status back to NEW."
		},

		params: ResourceModel.unassignRequestParams,

		response: {
			200: ResourceModel.unassignRequestResponse200
		}
	})

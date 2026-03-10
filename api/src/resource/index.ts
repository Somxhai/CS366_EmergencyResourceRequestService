import { Elysia } from 'elysia'
import { Resource } from './service'
import { ResourceModel } from './model'

export const resource = new Elysia({ prefix: '/v1/resource', tags: ['Resource'] })

	.post("/", ({ body }) => {
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
			400: ResourceModel.validationError
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
			404: ResourceModel.validationError
		}
	})

	.post("/:request_id/assign", ({ params, body }) => {
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
			404: ResourceModel.validationError
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
			404: ResourceModel.validationError
		}
	})

	.post("/:request_id/close", ({ params }) => {
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

	.post("/:request_id/unassign", ({ params }) => {
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

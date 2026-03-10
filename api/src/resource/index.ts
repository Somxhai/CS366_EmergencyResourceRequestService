import { Elysia } from 'elysia'
import { Resource } from './service'
import { ResourceModel } from './model'


export const resource = new Elysia({ prefix: '/v1/resource' }).post("/", ({ body }) => {
	// TODO: Implement key using redis caching
	// let idempotencyKey = headers['idempotency-key']
	return Resource.createRequest(body)
}, {
	body: ResourceModel['createRequestBody'],
	headers: ResourceModel.createRequestHeaders,
	response: {
		201: ResourceModel.createRequestResponse201,
		400: ResourceModel.validationError
	}
}).get("/list-request", ({ body }) => {
	return Resource.listRequests(body)
}, {
	body: ResourceModel['listRequestsQuery'],
	headers: ResourceModel['listRequestsHeaders'],
	response: {
		200: ResourceModel.listRequestsResponse200,
		404: ResourceModel.validationError
	}
})

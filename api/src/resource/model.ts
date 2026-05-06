import { t, type UnwrapSchema } from 'elysia'
import { ItemModel } from '../item/model'
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox'
import { resourceRequest } from '../db/schema'

const selectResourceSchema = createSelectSchema(resourceRequest, {
	id: t.String({ format: 'uuid', error: 'id must be a valid UUID' }),
	incidentId: t.String({ format: 'uuid', error: 'incidentId must be a valid UUID' })
})
const insertResourceSchema = createInsertSchema(resourceRequest, {
	incidentId: t.String({ format: 'uuid', error: 'incidentId must be a valid UUID' })
})

export const ResourceRequestStatus = t.Union([
	t.Literal('NEW'),
	t.Literal('IN_PROGRESS'),
	t.Literal('CLOSED')
], { error: 'status must be one of: NEW, IN_PROGRESS, CLOSED' })

export const ResourcePriority = t.Union([
	t.Literal('LOW'),
	t.Literal('NORMAL'),
	t.Literal('CRITICAL')
], { error: 'priority must be one of: LOW, NORMAL, CRITICAL' })

export const AsyncStatus = t.Union([
	t.Literal('ACCEPT'),
	t.Literal('REJECTED')
], { error: 'async status must be one of: ACCEPT, REJECTED' })

export const ResourceModel = {
	createRequestBody: t.Object({
		incidentId: insertResourceSchema.properties.incidentId,
		description: t.Optional(insertResourceSchema.properties.description),
		requestFor: insertResourceSchema.properties.requestFor,
		items: t.Optional(t.Array(ItemModel.body, { error: 'items must be an array' })),
		extraItems: t.Optional(t.Array(ItemModel.extra_item, { error: 'extraItems must be an array' })),
		from: t.Object({
			name: insertResourceSchema.properties.requesterName,
			location: t.Object({
				address: insertResourceSchema.properties.address,
				description: t.String({ error: 'location.description must be a string' }),
				latitude: insertResourceSchema.properties.latitude,
				longitude: insertResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: t.String({ minLength: 10, maxLength: 10, error: 'phone must be exactly 10 characters' })
			})
		}),
	}),
	createRequestHeaders: t.Object({
		'idempotency-key': t.String({ format: 'uuid', error: 'idempotency-key header must be a valid UUID' }),
		'x-trace-id': t.Optional(t.String({ format: 'uuid', error: 'x-trace-id must be a valid UUID' })),
	}),
	createRequestResponse201: t.Object({
		id: selectResourceSchema.properties.id,
		status: ResourceRequestStatus,
		requested_at: selectResourceSchema.properties.requestedAt
	}),
	createRequestAsyncResponse: t.Object({
		id: selectResourceSchema.properties.id,
		status: AsyncStatus
	}),
	error: t.Object({
		message: t.String()
	}),
	listRequestsHeaders: t.Object({
		'x-trace-id': t.Optional(t.String({ format: 'uuid', error: 'x-trace-id must be a valid UUID' })),
	}),
	listRequestsQuery: t.Object({
		incident_id: selectResourceSchema.properties.incidentId,
		status: t.Optional(ResourceRequestStatus),
		priority: t.Optional(ResourcePriority)
	}),
	listRequestsResponse200: t.Array(t.Object({
		id: selectResourceSchema.properties.id,
		items: t.Array(ItemModel.body),
		extra_items: t.Array(ItemModel.extra_item),
		from: t.Object({
			name: selectResourceSchema.properties.requesterName,
			location: t.Object({
				address: selectResourceSchema.properties.address,
				description: t.String({ error: 'location.description must be a string' }),
				latitude: selectResourceSchema.properties.latitude,
				longitude: selectResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: t.String({ minLength: 10, maxLength: 10, error: 'phone must be exactly 10 characters' })
			})
		}),
	})),
	createAssignTeam: t.Object({
		requestId: selectResourceSchema.properties.id,
		teamId: t.String({ error: 'teamId must be a string' })
	}),
	createAssignTeamResponse201: t.Object({
		request_id: selectResourceSchema.properties.id,
		team_id: t.String({ error: 'team_id must be a string' }),
		status: ResourceRequestStatus,
		assigned_at: selectResourceSchema.properties.requestedAt
	}),
	assignParams: t.Object({
		request_id: selectResourceSchema.properties.id
	}),
	getRequestParams: t.Object({
		request_id: selectResourceSchema.properties.id
	}),
	createAssignTeamBody: t.Object({
		team_id: t.String({ error: 'team_id must be a string' })
	}),
	getRequestResponse200: t.Object({
		id: selectResourceSchema.properties.id,
		items: t.Array(
			t.Object({
				id: t.String({ format: 'uuid', error: 'item.id must be a valid UUID' }),
				amount: t.Number({ error: 'item.amount must be a number' })
			})
		),
		extra_items: t.Array(
			t.Object({
				name: t.String({ error: 'extra_item.name must be a string' }),
				amount: t.Number({ error: 'extra_item.amount must be a number' })
			})
		),
		status: ResourceRequestStatus,
		priority: ResourcePriority,
		from: t.Object({
			name: selectResourceSchema.properties.requesterName,
			location: t.Object({
				address: selectResourceSchema.properties.address,
				description: t.String({ error: 'location.description must be a string' }),
				latitude: selectResourceSchema.properties.latitude,
				longitude: selectResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: t.String({ minLength: 10, maxLength: 10, error: 'phone must be exactly 10 characters' })
			})
		})
	}),
	finishRequestParams: t.Object({
		request_id: selectResourceSchema.properties.id
	}),
	finishRequestResponse200: t.Object({
		request_id: selectResourceSchema.properties.id,
		status: ResourceRequestStatus
	}),
	unassignRequestParams: t.Object({
		request_id: selectResourceSchema.properties.id
	}),
	unassignRequestResponse200: t.Object({
		request_id: selectResourceSchema.properties.id,
		status: ResourceRequestStatus
	}),
} as const

export type ResourceModel = {
	[k in keyof typeof ResourceModel]: UnwrapSchema<typeof ResourceModel[k]>
}

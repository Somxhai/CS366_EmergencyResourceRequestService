import { t, type UnwrapSchema } from 'elysia'
import { ItemModel } from '../item/model'
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox'
import { resourceRequest } from '../db/schema'

// 1. Generate base schemas, overriding specific fields with Elysia validations
const selectResourceSchema = createSelectSchema(resourceRequest, {
	id: t.String({ format: 'uuid' }),
	incidentId: t.String({ format: 'uuid' })
})

const insertResourceSchema = createInsertSchema(resourceRequest, {
	incidentId: t.String({ format: 'uuid' })
})

// 2. Extract exact enums and fields straight from the Drizzle schemas
export const ResourceRequestStatus = t.Union([
	t.Literal('NEW'),
	t.Literal('IN_PROGRESS'),
	t.Literal('CLOSED')
])
export const ResourcePriority = t.Union([
	t.Literal('LOW'),
	t.Literal('NORMAL'),
	t.Literal('CRITICAL')
])

export const AsyncStatus = t.Union([
	t.Literal('ACCEPT'),
	t.Literal('REJECTED')
])

export const ResourceModel = {
	createRequestBody: t.Object({
		// Mapped directly to DB schema while maintaining the nested API structure
		incidentId: insertResourceSchema.properties.incidentId,
		description: t.Optional(insertResourceSchema.properties.description),
		requestFor: insertResourceSchema.properties.requestFor,

		items: t.Array(ItemModel.body),
		extraItems: t.Optional(t.Array(ItemModel.extra_item)),

		from: t.Object({
			name: insertResourceSchema.properties.requesterName,
			location: t.Object({
				address: insertResourceSchema.properties.address,
				description: t.String(),
				latitude: insertResourceSchema.properties.latitude,
				longitude: insertResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: insertResourceSchema.properties.phone
			})
		}),
	}),

	createRequestHeaders: t.Object({
		'idempotency-key': t.String({ format: 'uuid' }),
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
		// authorization: t.String()
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
				description: t.String(),
				latitude: selectResourceSchema.properties.latitude,
				longitude: selectResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: selectResourceSchema.properties.phone
			})
		}),
	})),

	createAssignTeam: t.Object({
		requestId: selectResourceSchema.properties.id,
		teamId: t.String()
	}),

	createAssignTeamResponse201: t.Object({
		request_id: selectResourceSchema.properties.id,
		team_id: t.String(),
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
		team_id: t.String()
	}),

	getRequestResponse200: t.Object({
		id: selectResourceSchema.properties.id,
		items: t.Array(
			t.Object({
				id: t.String(),
				amount: t.Number()
			})
		),
		extra_items: t.Array(
			t.Object({
				name: t.String(),
				amount: t.Number()
			})
		),
		status: ResourceRequestStatus,
		priority: ResourcePriority,
		from: t.Object({
			name: selectResourceSchema.properties.requesterName,
			location: t.Object({
				address: selectResourceSchema.properties.address,
				description: t.String(),
				latitude: selectResourceSchema.properties.latitude,
				longitude: selectResourceSchema.properties.longitude
			}),
			contact: t.Object({
				phone: selectResourceSchema.properties.phone
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

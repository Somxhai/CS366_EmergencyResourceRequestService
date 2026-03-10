import { t, type UnwrapSchema } from 'elysia'
import { ItemModel } from '../item/model'
import { ResourceRequestStatus } from '../../generated/prismabox/ResourceRequestStatus'
import { ResourcePriority } from '../../generated/prismabox/ResourcePriority'


export const ResourceModel = {
	createRequestBody: t.Object({
		incidentId: t.String({ format: 'uuid' }),
		description: t.Optional(t.String()),
		requestFor: t.String(),
		items: t.Array(ItemModel.body),
		extraItems: t.Optional(t.Array(ItemModel.extra_item)),
		from: t.Object({
			name: t.String(),
			location: t.Object({
				address: t.String(),
				description: t.String(),
				latitude: t.Number(),
				longitude: t.Number()
			}),
			contact: t.Object({
				phone: t.String()
			})
		}),
	}),
	createRequestHeaders: t.Object({
		'idempotency-key': t.String({ format: 'uuid' }),
		'content-type': t.Literal('application/json')
	}),
	createRequestResponse201: t.Object({
		id: t.String(),
		status: ResourceRequestStatus,
		requested_at: t.Date()
	}),

	validationError: t.Object({
		code: t.Literal('VALIDATION_ERROR'),
		message: t.String()
	}),

	listRequestsHeaders: t.Object({
		authorization: t.String()
	}),
	listRequestsQuery: t.Object({
		incident_id: t.String({ format: 'uuid' }),
		status: ResourceRequestStatus,
		priority: t.Optional(ResourcePriority)
	}),
	listRequestsResponse200: t.Array(t.Object({
		id: t.String(),
		items: t.Array(ItemModel.body),
		extra_items: t.Array(ItemModel.extra_item),
		from: t.Object({
			name: t.String(),
			location: t.Object({
				address: t.String(),
				description: t.String(),
				latitude: t.Number(),
				longitude: t.Number()
			}),
			contact: t.Object({
				phone: t.String()
			})
		}),
	})),

	createAssignTeam: t.Object({
		requestId: t.String(),
		teamId: t.String()
	}),

	createAssignTeamResponse201: t.Object({
		request_id: t.String({
			format: "uuid"
		}),

		team_id: t.String(),

		status: ResourceRequestStatus,
		assigned_at: t.Date()
	}),
	assignParams: t.Object({
		request_id: t.String({ format: "uuid" })
	}),
	getRequestParams: t.Object({
		request_id: t.String({ format: "uuid" })
	}),

	createAssignTeamBody: t.Object({
		team_id: t.String()
	}),
	getRequestResponse200: t.Object({
		id: t.String({ format: "uuid" }),

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
			name: t.String(),

			location: t.Object({
				address: t.String(),
				description: t.String(),
				latitude: t.Number(),
				longitude: t.Number()
			}),

			contact: t.Object({
				phone: t.String()
			})
		})
	}),

	finishRequestParams: t.Object({
		request_id: t.String({ format: "uuid" })
	}),

	finishRequestResponse200: t.Object({
		request_id: t.String({ format: "uuid" }),
		status: ResourceRequestStatus
	}),

	unassignRequestParams: t.Object({
		request_id: t.String({ format: "uuid" })
	}),

	unassignRequestResponse200: t.Object({
		request_id: t.String({ format: "uuid" }),
		status: ResourceRequestStatus
	}),



} as const

export type ResourceModel = {
	[k in keyof typeof ResourceModel]: UnwrapSchema<typeof ResourceModel[k]>
}

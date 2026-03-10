import { randomUUIDv7 } from "bun";
import { prisma } from "../lib/prisma";
import type { ResourceModel } from "./model";
import { status } from "elysia";


export abstract class Resource {
	static async createRequest({
		incidentId, items, extraItems, from, idempotencyKey, requestFor, description
	}: ResourceModel['createRequestBody']
	) {
		let resource = await prisma.resourceRequest.create({
			data: {
				id: randomUUIDv7(),
				incidentId: incidentId,
				priority: "NEUTRAL",
				requestFor: requestFor,
				requesterName: from.name,
				phone: from.contact.phone,
				description,

				address: from.location.address,
				latitude: from.location.latitude,
				longitude: from.location.longitude,

				items: {
					create: items.map((item) => ({
						itemId: item.id,
						amount: item.amount
					}))
				},

				extraItems: {
					create: extraItems?.map((item) => ({
						name: item.name,
						amount: item.amount
					})) ?? []
				}
			}
		})

		return {
			id: resource.id,
			status: resource.status ?? "NEW",
			requested_at: resource.requestedAt
		} satisfies ResourceModel['createRequestResponse201']
	}

	static async broadcastCreateRequest() { }

	static async listRequests({ incident_id, status: requestStatus, priority }: ResourceModel['listRequestsQuery']) {

		const incidentExists = true
		if (!incidentExists) {
			throw status(
				404,
				{
					code: 'VALIDATION_ERROR',
					message: `Incident ${incident_id} not found`
				} satisfies ResourceModel['validationError']
			)
		}

		const requests = await prisma.resourceRequest.findMany({
			where: {
				incidentId: incident_id,
				...(requestStatus && { status: requestStatus }),
				...(priority && { priority })
			},
			include: {
				items: true,
				extraItems: true
			}
		})

		return requests.map((req) => ({
			id: req.id,

			items: req.items.map((item) => ({
				id: item.itemId,
				amount: item.amount
			})),

			extra_items: req.extraItems.map((item) => ({
				name: item.name,
				amount: item.amount
			})),

			from: {
				name: req.requesterName,
				location: {
					address: req.address,
					description: req.description ?? "",
					latitude: req.latitude,
					longitude: req.longitude
				},
				contact: {
					phone: req.phone
				}
			}
		})) satisfies ResourceModel['listRequestsResponse200']
	}
}

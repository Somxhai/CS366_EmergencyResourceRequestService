import { randomUUIDv7 } from "bun";
import { prisma } from "../lib/prisma";
import type { ResourceModel } from "./model";
import { status } from "elysia";


export abstract class Resource {
	static async createRequest({
		incidentId, items, extraItems, from, requestFor, description
	}: ResourceModel['createRequestBody']
	) {
		let resource = await prisma.resourceRequest.create({
			data: {
				id: randomUUIDv7(),
				incidentId: incidentId,
				priority: "NORMAL",
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

	static async assign_to({ requestId, teamId }: ResourceModel['createAssignTeam']) {

		const result = await prisma.$transaction(async (tx) => {

			const request = await tx.resourceRequest.update({
				where: { id: requestId },
				data: { status: "IN_PROGRESS" }
			})

			const assign = await tx.assignTeam.create({
				data: {
					requestId,
					teamId
				}
			})

			return { request, assign }
		})

		return {
			request_id: result.request.id,
			team_id: result.assign.teamId,
			status: result.request.status,
			assigned_at: result.assign.assignedAt,
		} satisfies ResourceModel['createAssignTeamResponse201']

	}

	static async getRequestById(requestId: string) {

		const req = await prisma.resourceRequest.findUnique({
			where: { id: requestId },
			include: {
				items: true,
				extraItems: true
			}
		})

		if (!req) {
			throw status(404, {
				code: "VALIDATION_ERROR",
				message: `Request ${requestId} not found`
			})
		}

		return {
			id: req.id,
			status: req.status,
			priority: req.priority,

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
		}
	}
	static async closeRequest(requestId: string) {

		const req = await prisma.resourceRequest.update({
			where: { id: requestId },
			data: { status: "CLOSED" }
		})

		return {
			request_id: req.id,
			status: req.status
		}
	}

	static async unassignRequest(requestId: string): Promise<ResourceModel['unassignRequestResponse200']> {

		await prisma.$transaction([
			prisma.assignTeam.deleteMany({
				where: { requestId }
			}),

			prisma.resourceRequest.update({
				where: { id: requestId },
				data: { status: "NEW" }
			})
		])

		return {
			request_id: requestId,
			status: "NEW"
		}
	}
}

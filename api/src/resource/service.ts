import { randomUUIDv7 } from "bun";
import { eq, and } from "drizzle-orm";
import { type ResourceModel } from "./model";
import { status } from "elysia";
import { PublishCommand } from "@aws-sdk/client-sns";
import { sns } from "../lib/sns";
import { db } from "../lib/db";
import { resourceRequest, assignTeam, requestedItem, requestedExtraItem } from "../db/schema";
import { getIncident } from "../lib/incident";

export abstract class Resource {
	static async createRequest({
		incidentId, items, extraItems, from, requestFor, description
	}: ResourceModel['createRequestBody']) {
		const newRequestId = randomUUIDv7();

		const resource = await db.transaction(async (tx) => {
			const [req] = await tx.insert(resourceRequest).values({
				id: newRequestId,
				incidentId: incidentId,
				priority: "NORMAL",
				requestFor: requestFor,
				requesterName: from.name,
				phone: from.contact.phone,
				description,
				address: from.location.address,
				latitude: from.location.latitude,
				longitude: from.location.longitude,
			}).returning();

			if (items && items.length > 0) {
				await tx.insert(requestedItem).values(
					items.map((item) => ({
						requestId: newRequestId,
						itemId: item.id,
						amount: item.amount
					}))
				);
			}

			if (extraItems && extraItems.length > 0) {
				await tx.insert(requestedExtraItem).values(
					extraItems.map((item) => ({
						requestId: newRequestId,
						name: item.name,
						amount: item.amount
					}))
				);
			}

			return req;
		});

		return {
			id: resource.id,
			status: resource.status ?? "NEW",
			requested_at: resource.requestedAt
		} satisfies ResourceModel['createRequestResponse201'];
	}

	static async createRequestAsync({
		incidentId, items, extraItems, from, requestFor, description
	}: ResourceModel['createRequestBody']) {

		const incident = await getIncident(incidentId);
		const body = {
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
			},
			verified: incident !== null,
		};

		try {
			await sns.send(
				new PublishCommand({
					TopicArn: process.env.RESOURCE_REQUEST_TOPIC,
					Message: JSON.stringify({
						type: "resource_request.create",
						payload: body
					})
				})
			);
			console.log(`Send message to SNS Topic ${body.id}`)
			return {
				id: body.id,
				status: "ACCEPT"
			} satisfies ResourceModel['createRequestAsyncResponse'];

		} catch (e) {
			console.error(e);
			return {
				id: body.id,
				status: "REJECTED"
			} satisfies ResourceModel['createRequestAsyncResponse'];
		}
	}

	static async broadcastCreateRequest() { }

	static async listRequests({ incident_id, status: requestStatus, priority }: ResourceModel['listRequestsQuery']) {
		const conditions = [eq(resourceRequest.incidentId, incident_id)];

		if (requestStatus) {
			conditions.push(eq(resourceRequest.status, requestStatus));
		}

		if (priority) {
			conditions.push(eq(resourceRequest.priority, priority));
		}

		const requests = await db.select()
			.from(resourceRequest)
			.where(and(...conditions));

		const results = await Promise.all(requests.map(async (req) => {
			const items = await db.select().from(requestedItem).where(eq(requestedItem.requestId, req.id));
			const extraItems = await db.select().from(requestedExtraItem).where(eq(requestedExtraItem.requestId, req.id));

			return {
				id: req.id,
				items: items.map((item) => ({
					id: item.itemId,
					amount: item.amount
				})),
				extra_items: extraItems.map((item) => ({
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
			};
		}));

		return results satisfies ResourceModel['listRequestsResponse200'];
	}

	static async assign_to({ requestId, teamId }: ResourceModel['createAssignTeam']) {
		const result = await db.transaction(async (tx) => {
			const [currentRequest] = await tx.select()
				.from(resourceRequest)
				.where(eq(resourceRequest.id, requestId))
				.limit(1);

			if (!currentRequest) {
				throw status(404, {
					code: "VALIDATION_ERROR",
					message: `Request ${requestId} not found`
				});
			}

			if (currentRequest.status === "CLOSED") {
				throw status(400, {
					code: "VALIDATION_ERROR",
					message: "Cannot assign team: request is already CLOSED"
				});
			}

			const [request] = await tx.update(resourceRequest)
				.set({ status: "IN_PROGRESS" })
				.where(eq(resourceRequest.id, requestId))
				.returning();

			const [assign] = await tx.insert(assignTeam)
				.values({ requestId, teamId })
				.returning();

			return { request, assign };
		});

		return {
			request_id: result.request.id,
			team_id: result.assign.teamId,
			status: result.request.status,
			assigned_at: result.assign.assignedAt,
		} satisfies ResourceModel['createAssignTeamResponse201'];
	}

	static async getRequestById(requestId: string) {
		const [req] = await db.select()
			.from(resourceRequest)
			.where(eq(resourceRequest.id, requestId))
			.limit(1);

		if (!req) {
			throw status(404, {
				code: "VALIDATION_ERROR",
				message: `Request ${requestId} not found`
			});
		}

		const items = await db.select().from(requestedItem).where(eq(requestedItem.requestId, req.id));
		const extraItems = await db.select().from(requestedExtraItem).where(eq(requestedExtraItem.requestId, req.id));

		return {
			id: req.id,
			status: req.status,
			priority: req.priority,
			items: items.map((item) => ({
				id: item.itemId,
				amount: item.amount
			})),
			extra_items: extraItems.map((item) => ({
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
		};
	}

	static async closeRequest(requestId: string) {
		const [req] = await db.update(resourceRequest)
			.set({ status: "CLOSED" })
			.where(eq(resourceRequest.id, requestId))
			.returning();

		return {
			request_id: req.id,
			status: req.status
		};
	}

	static async unassignRequest(requestId: string): Promise<ResourceModel['unassignRequestResponse200']> {
		await db.transaction(async (tx) => {
			await tx.delete(assignTeam).where(eq(assignTeam.requestId, requestId));

			await tx.update(resourceRequest)
				.set({ status: "NEW" })
				.where(eq(resourceRequest.id, requestId));
		});

		return {
			request_id: requestId,
			status: "NEW"
		};
	}
}

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import type { SQSEvent } from "aws-lambda";
import { drizzle } from "drizzle-orm/node-postgres";
import { requestedExtraItem, requestedItem, resourceRequest } from "./schema";
import pg from "pg"

const sns = new SNSClient({});

const pool = new pg.Pool({
	host: process.env.DB_HOST!,
	user: process.env.DB_USER!,
	password: process.env.DB_PASSWORD!,
	database: process.env.DB_DATABASE!,
	port: Number(process.env.DB_PORT) || 5432,

	ssl: process.env.ENV?.toLowerCase() == "dev" ? false : { rejectUnauthorized: false },
	max: 1,
});

const db = drizzle({ client: pool });

type Item = { itemId: string; amount: number };
type ExtraItem = { name: string; amount: number };

type Payload = {
	id: string,
	traceId: string,
	incidentId: string,
	priority: "UNDECIDED",
	requestFor: string,
	requesterName: string,
	phone: string,
	description: string,
	address: string,
	latitude: number,
	longitude: number,
	items: { create: { itemId: string, amount: number }[] },
	extraItems: { create: { name: string, amount: number }[] },
	verified: boolean,
}

export const handler = async (event: SQSEvent) => {
	for (const record of event.Records) {
		const sqsBody = JSON.parse(record.body);
		const snsMessage = JSON.parse(sqsBody.Message);

		if (snsMessage.type !== "resource_request.create") continue;

		const p: Payload = snsMessage.payload;

		try {
			let inserted = false;

			await db.transaction(async (tx) => {
				const result = await tx.insert(resourceRequest).values({
					id: p.id,
					incidentId: p.incidentId,
					priority: p.priority ?? "UNDECIDED",
					requestFor: p.requestFor,
					requesterName: p.requesterName,
					phone: p.phone,
					address: p.address,
					description: p.description ?? null,
					latitude: p.latitude,
					longitude: p.longitude,
					verified: p.verified,
				}).onConflictDoNothing().returning({ id: resourceRequest.id });

				if (result.length === 0) {
					console.log(`[SKIP] Duplicate request ${p.id}, skipping insert and publish`);
					return;
				}

				inserted = true;

				const items: Item[] = p.items?.create ?? [];
				if (items.length > 0) {
					await tx.insert(requestedItem).values(
						items.map((item) => ({
							requestId: p.id,
							itemId: item.itemId,
							amount: item.amount,
						}))
					).onConflictDoNothing();
				}

				const extraItems: ExtraItem[] = p.extraItems?.create ?? [];
				if (extraItems.length > 0) {
					await tx.insert(requestedExtraItem).values(
						extraItems.map((item) => ({
							requestId: p.id,
							name: item.name,
							amount: item.amount,
						}))
					).onConflictDoNothing();
				}
			});

			if (inserted) {
				await Promise.all([publish_to_event(p), publish_to_prioritize(p)]);
				console.log(`[SUCCESS] Inserted and published request ${p.id}`);
			}
		} catch (err) {
			console.error(`[ERROR] Failed to process request ${p.id}:`, err);
			throw err;
		}
	}

	return "Done";
};


export const publish_to_event = async (p: Payload) => {
	await sns.send(new PublishCommand({
		TopicArn: process.env.EVENT_SNS_TOPIC_ARN,
		Message: JSON.stringify({
			type: "resource_request.created_success",
			payload: { id: p.id, status: "NEW", timestamp: new Date().toISOString() }
		}),
		MessageAttributes: {
			traceId: { DataType: "String", StringValue: p.traceId },
			messageId: { DataType: "String", StringValue: crypto.randomUUID() },
			version: { DataType: "String", StringValue: "1" },
			event_type: { DataType: "String", StringValue: "resource_request.created_success" }
		}
	}));

}
export const publish_to_prioritize = async (p: Payload) => {
	const now = new Date().toISOString();
	await sns.send(new PublishCommand({
		TopicArn: process.env.PRIORITIZATION_TOPIC_ARN,
		Message: JSON.stringify({
			requestId: p.id,
			incidentId: p.incidentId,
			requestType: p.requestFor,
			description: p.description,
			peopleCount: 1,
			specialNeeds: [],
			items: p.extraItems?.create ?? [],
			location: {
				latitude: p.latitude,
				longitude: p.longitude,
				province: null,
				district: null,
				subdistrict: null,
				addressLine: p.address ?? null,
			},
			submittedAt: new Date().toISOString(),
			header: {
				messageType: "ResourceRequestCreated",
				messageId: crypto.randomUUID(),
				sentAt: now,
				traceId: p.traceId,
				version: 1,
			}
		}),
		// MessageAttributes: {
		// 	messageType: { DataType: "String", StringValue: "ResourceRequestCreated" },
		// 	messageId: { DataType: "String", StringValue: crypto.randomUUID() },
		// 	sentAt: { DataType: "String", StringValue: new Date().toISOString() },
		// 	traceId: { DataType: "String", StringValue: p.traceId },
		// 	version: { DataType: "String", StringValue: "1" },
		// }
	}))
}

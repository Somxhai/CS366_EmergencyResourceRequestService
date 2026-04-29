import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import type { SQSEvent } from "aws-lambda";
import { drizzle } from "drizzle-orm/node-postgres";
import { resourceRequest } from "./schema";
import { eq } from "drizzle-orm";
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

type PriorityLevel = "UNDECIDED" | "LOW" | "NORMAL" | "HIGH" | "CRITICAL"

type Payload = {
	requestId: string,
	incidentId: string,
	evaluateId: string,
	priorityScore: number,
	priorityLevel: PriorityLevel,
	evaluateReason: string,
	lastEvaluatedAt: string,
}

export const handler = async (event: SQSEvent) => {
	for (const record of event.Records) {
		const sqsBody = JSON.parse(record.body);
		const snsMessage = JSON.parse(sqsBody.Message);
		const p: Payload = snsMessage;
		const traceId = record.messageAttributes?.correlationId?.stringValue ?? crypto.randomUUID();

		try {
			const result = await db.update(resourceRequest)
				.set({ priority: p.priorityLevel })
				.where(eq(resourceRequest.id, p.requestId))
				.returning({ id: resourceRequest.id });

			if (result.length === 0) {
				console.log(`[SKIP] Request ${p.requestId} not found, skipping update`);
				continue;
			}

			await publish_to_event(p, traceId);
			console.log(`[SUCCESS] Updated priority for request ${p.requestId} to ${p.priorityLevel} (score: ${p.priorityScore})`);
		} catch (err) {
			console.error(`[ERROR] Failed to process request ${p.requestId}:`, err);
			throw err;
		}
	}
	return "Done";
};

export const publish_to_event = async (p: Payload, traceId: string) => {
	await sns.send(new PublishCommand({
		TopicArn: process.env.EVENT_SNS_TOPIC_ARN,
		Message: JSON.stringify({
			type: "resource_request.priority_updated",
			payload: {
				id: p.requestId,
				priorityLevel: p.priorityLevel,
				priorityScore: p.priorityScore,
				timestamp: new Date().toISOString()
			}
		}),
		MessageAttributes: {
			traceId: { DataType: "String", StringValue: traceId },
			messageId: { DataType: "String", StringValue: crypto.randomUUID() },
			version: { DataType: "String", StringValue: "1" },
			event_type: { DataType: "String", StringValue: "resource_request.priority_updated" }
		}
	}));
}

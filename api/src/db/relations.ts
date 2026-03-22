import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	assignTeam: {
		resourceRequest: r.one.resourceRequest({
			from: r.assignTeam.requestId,
			to: r.resourceRequest.id
		}),
	},
	resourceRequest: {
		assignTeams: r.many.assignTeam(),
		requestedExtraItems: r.many.requestedExtraItem(),
		requestedItems: r.many.requestedItem(),
	},
	requestedExtraItem: {
		resourceRequest: r.one.resourceRequest({
			from: r.requestedExtraItem.requestId,
			to: r.resourceRequest.id
		}),
	},
	requestedItem: {
		resourceRequest: r.one.resourceRequest({
			from: r.requestedItem.requestId,
			to: r.resourceRequest.id
		}),
	},
}))
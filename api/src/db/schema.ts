import { pgEnum, pgTable, uuid, text, integer, timestamp, doublePrecision, index, foreignKey, primaryKey, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const resourcePriority = pgEnum("resource_priority", ["LOW", "NORMAL", "CRITICAL"])
export const resourceRequestStatus = pgEnum("resource_request_status", ["NEW", "IN_PROGRESS", "CLOSED"])


export const assignTeam = pgTable("assign_team", {
	id: uuid().defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => resourceRequest.id, { onDelete: "cascade" }),
	teamId: text("team_id").notNull(),
	assignedAt: timestamp("assigned_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("assign_team_request_id_idx").using("btree", table.requestId.asc().nullsLast()),
]);

export const requestedExtraItem = pgTable("requested_extra_item", {
	id: uuid().defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => resourceRequest.id, { onDelete: "cascade" }),
	name: text().notNull(),
	amount: integer().notNull(),
}, (table) => [
	index("requested_extra_item_request_id_idx").using("btree", table.requestId.asc().nullsLast()),
]);

export const requestedItem = pgTable("requested_item", {
	id: uuid().defaultRandom().primaryKey(),
	requestId: uuid("request_id").notNull().references(() => resourceRequest.id, { onDelete: "cascade" }),
	itemId: text("item_id").notNull(),
	amount: integer().notNull(),
}, (table) => [
	index("requested_item_request_id_idx").using("btree", table.requestId.asc().nullsLast()),
]);

export const resourceRequest = pgTable("resource_request", {
	id: uuid().defaultRandom().primaryKey(),
	incidentId: uuid("incident_id").notNull(),
	priority: resourcePriority().default("NORMAL").notNull(),
	requestFor: text("request_for").notNull(),
	status: resourceRequestStatus().default("NEW").notNull(),
	requestedAt: timestamp("requested_at", { withTimezone: true }).default(sql`now()`).notNull(),
	requesterName: text("requester_name").notNull(),
	phone: text().notNull(),
	address: text().notNull(),
	description: text(),
	latitude: doublePrecision().notNull(),
	longitude: doublePrecision().notNull(),
	verified: boolean("verified").default(false).notNull()
});

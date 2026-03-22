-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "resource_priority" AS ENUM('LOW', 'NORMAL', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "resource_request_status" AS ENUM('NEW', 'IN_PROGRESS', 'CLOSED');--> statement-breakpoint
CREATE TABLE "assign_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"team_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requested_extra_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requested_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"request_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"incident_id" text NOT NULL,
	"priority" "resource_priority" DEFAULT 'NORMAL'::"resource_priority" NOT NULL,
	"request_for" text NOT NULL,
	"status" "resource_request_status" DEFAULT 'NEW'::"resource_request_status" NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"requester_name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
CREATE INDEX "assign_team_request_id_idx" ON "assign_team" ("request_id");--> statement-breakpoint
CREATE INDEX "requested_extra_item_request_id_idx" ON "requested_extra_item" ("request_id");--> statement-breakpoint
CREATE INDEX "requested_item_request_id_idx" ON "requested_item" ("request_id");--> statement-breakpoint
ALTER TABLE "assign_team" ADD CONSTRAINT "assign_team_request_id_resource_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "resource_request"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "requested_extra_item" ADD CONSTRAINT "requested_extra_item_request_id_resource_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "resource_request"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "requested_item" ADD CONSTRAINT "requested_item_request_id_resource_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "resource_request"("id") ON DELETE CASCADE;
*/
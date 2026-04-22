export interface TimelineEntry {
	time: string;       // string<date-time>
	event: string;
	detail: string;
}

export interface Incident {
	incident_id: string;                                                                    // string<uuid>
	incident_type: "fire" | "flood" | "storm" | "earthquake" | "explosion" | "generic";
	incident_description: string;
	exact_location: string;                                                                 // "latitude,longitude"
	exact_location_description: string;
	impact_level: 1 | 2 | 3;
	priority: "Low" | "Medium" | "High";
	status: "REPORTED" | "DISPATCHED" | "ON-SITE" | "RESOLVED" | "CLOSED";
	reported_by: string;
	source_report_id: string;
	created_at: string;                                                                     // string<date-time>
	updated_at: string;                                                                     // string<date-time>
	timeline: TimelineEntry[];
}

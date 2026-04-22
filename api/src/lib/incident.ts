import { Incident } from "../incident/model";



export const getIncident = async (incident_id: string): Promise<Incident | null> => {
	const response = await fetch(
		`${process.env.INCIDENT_SERVICE_URL}/incidents/${incident_id}`,
		{
			method: "GET",
			headers: {
				"X-IncidentTNX-Id": crypto.randomUUID(),
				"Content-Type": "application/json"
			}
		}
	);

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Failed to fetch incident: ${response.status}`);
	}

	return await response.json();
};

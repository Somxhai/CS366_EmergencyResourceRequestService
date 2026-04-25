import { Incident } from "../incident/model";



export const getIncident = async (incident_id: string): Promise<Incident | null> => {
	try {
		const response = await fetch(
			`${process.env.INCIDENT_SERVICE_URL}/incidents/${incident_id}`,
			{
				method: "GET",
				headers: {
					"X-IncidentTNX-Id": crypto.randomUUID(),
					"api-key": "123",
					"Content-Type": "application/json"
				},
				signal: AbortSignal.timeout(5000)
			}
		);

		console.log("incident_json: ", await response.text())

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch incident: ${response.status}`);
		}

		return await response.json();
	} catch (err: any) {
		if (err.name === "TimeoutError" || err.name === "AbortError") {
			throw new Error("Incident service request timed out");
		}
		throw err;
	}
};

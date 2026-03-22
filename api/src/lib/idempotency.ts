import { valkeyClient } from "./valkey"

import { TimeUnit } from "@valkey/valkey-glide"; // Make sure to import this!

/**
 * Attempts to lock an idempotency key.
 * @returns {boolean} true if this is a new request (lock acquired), false if it's a duplicate.
 */
export const checkAndSetIdempotencyKey = async (key: string): Promise<boolean> => {
	const expirationInSeconds = 30; // 24 hours, adjust as needed

	// Pass the options as the 3rd argument
	const result = await valkeyClient.set(key, "processing", {
		conditionalSet: "onlyIfDoesNotExist", // This is the Glide equivalent of "NX"
		expiry: {
			type: TimeUnit.Seconds,           // This is the Glide equivalent of "EX"
			count: expirationInSeconds
		}
	});

	// If result is "OK", we successfully set the key (new request)
	// If result is null, the key already existed (duplicate request)
	return result === "OK";
}

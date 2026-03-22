import { GlideClient } from "@valkey/valkey-glide";

export const valkeyClient = await GlideClient.createClient({
	addresses: [{ host: process.env.VALKEY_ENDPOINT ?? "", port: process.env.VALKEY_PORT }], useTLS: false
});

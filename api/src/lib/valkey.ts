import { GlideClient } from "@valkey/valkey-glide";

export const valkeyClient = await GlideClient.createClient({
	addresses: [{
		host: process.env.VALKEY_ENDPOINT ?? "",
		port: Number(process.env.VALKEY_PORT) || 6379
	}],
	useTLS: false,
	credentials: {
		username: "default",
		password: process.env.VALKEY_PASSWORD ?? ""
	}
});

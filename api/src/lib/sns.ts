import { SNSClient } from "@aws-sdk/client-sns";
// import { FetchHttpHandler } from "@smithy/fetch-http-handler";

export const sns = new SNSClient({
	// requestHandler: new FetchHttpHandler()
})

import { SNSClient } from "@aws-sdk/client-sns";
// import { FetchHttpHandler } from "@smithy/fetch-http-handler";

export const sns = new SNSClient({
	region: 'ap-southeast-7',
	// requestHandler: new FetchHttpHandler()
})

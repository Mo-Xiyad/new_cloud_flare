import * as Realm from 'realm-web';

// Define type alias; available via `realm-web`
type Document = globalThis.Realm.Services.MongoDB.Document;

let App: Realm.App;

interface IUser extends Document {
	id: string;
	name: string;
}
const ObjectId = Realm.BSON.ObjectID;

export interface Env {
	REALM_APPID: string;
	ATLAS_API_KEY: string;
}

// export default {
// 	// The scheduled handler is invoked at the interval set in our wrangler.toml's
// 	// [[triggers]] configuration.
// 	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
// 		// A Cron Trigger can make requests to other endpoints on the Internet,
// 		// publish to a Queue, query a D1 Database, and much more.
// 		//
// 		// We'll keep it simple and make an API call to a Cloudflare API:
// 		let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
// 		let wasSuccessful = resp.ok ? 'success' : 'fail';

// 		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
// 		// In this template, we'll just log the result:
// 		console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
// 	},
// };

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		App = App || new Realm.App(env.REALM_APPID);
		try {
			const credentials = Realm.Credentials.apiKey(env.ATLAS_API_KEY);
			// Attempt to authenticate
			var user = await App.logIn(credentials);
			var client = user.mongoClient('mongodb-atlas');
		} catch (err) {
			return new Response('Error with authentication.', { status: 500 });
		}
		// Grab a reference to the "cloudflare.todos" collection

		const collection = client.db('pleo').collection<IUser>('pleo-expense');

		return new Response('Hello World!');
	},
};

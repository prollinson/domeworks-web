// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// Cloudflare Email binding, attached in Pages project settings.
// Requires Email Routing enabled on domeworks.tech with piers@domeworks.tech as a verified destination.
interface SendEmailBinding {
	send(message: {
		from: string;
		to: string;
		raw: ReadableStream | string;
	}): Promise<void>;
}

declare namespace App {
	// interface Locals {}
	interface Platform {
		env?: {
			SEB?: SendEmailBinding;
		};
	}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

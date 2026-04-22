// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// Cloudflare Send Email binding (declared in wrangler.jsonc).
// Requires Email Routing enabled on domeworks.tech with piers@domeworks.tech as a verified destination.
interface SendEmailBinding {
	send(message: {
		from: string;
		to: string;
		subject: string;
		text: string;
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

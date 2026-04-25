// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// Cloudflare Send Email binding (declared in wrangler.jsonc).
// Requires Email Routing enabled on domeworks.tech with piers@domeworks.tech as a verified destination.
interface SendEmailBinding {
	send(message: { from: string; to: string; subject: string; text: string }): Promise<void>;
}

// Minimal D1 surface used by the SMB audit code paths.
// Cloudflare's @cloudflare/workers-types ships a richer type; this is just enough.
interface D1Binding {
	prepare(query: string): {
		bind(...values: unknown[]): {
			run(): Promise<unknown>;
			first<T = unknown>(): Promise<T | null>;
			all<T = unknown>(): Promise<{ results: T[] }>;
		};
	};
}

// R2 bucket binding for stage 1 report markdown export.
interface R2Binding {
	put(
		key: string,
		value: string | ArrayBuffer | ReadableStream,
		opts?: { httpMetadata?: { contentType?: string } }
	): Promise<unknown>;
	get(key: string): Promise<{ body: ReadableStream; text(): Promise<string> } | null>;
}

declare namespace App {
	// interface Locals {}
	interface Platform {
		env?: {
			SEB?: SendEmailBinding;
			ANTHROPIC_API_KEY?: string;
			AI_GATEWAY_URL?: string;
			ATTIO_API_KEY?: string;
			QUIZ_SUBMISSIONS?: D1Binding;
			REPORTS_BUCKET?: R2Binding;
		};
	}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

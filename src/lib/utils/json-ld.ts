/* Build a JSON-LD <script> tag string for use with {@html ...} inside
   <svelte:head>. The literal `<script>` token in a .svelte file trips
   eslint-plugin-svelte's parser even when it sits inside a JS template
   literal, so we keep the markup-building in TypeScript. JSON values get
   `<` escaped to `<` so a `</script>` appearing inside a string
   cannot break out of the script tag. */
export function buildJsonLdScript(schema: Record<string, unknown> | unknown[]): string {
	const safeJson = JSON.stringify(schema).replace(/</g, '\\u003c');
	const open = String.fromCharCode(60) + 'script type="application/ld+json">';
	const close = String.fromCharCode(60) + '/script>';
	return open + safeJson + close;
}

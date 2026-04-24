<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { getBookCallUrl, generateGeneralMailto } from '$lib/utils/mailto';
</script>

<svelte:head>
	<title>Book a Discovery Call | AI Infrastructure Help | DomeWorks</title>
	<meta
		name="description"
		content="Book a 30-minute discovery call to discuss your team's AI adoption. I'll ask about your team, your tools, and where things are stuck."
	/>
	<link rel="canonical" href="https://domeworks.tech/contact/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/contact/" />
	<meta property="og:title" content="Book a Discovery Call | AI Infrastructure Help | DomeWorks" />
	<meta
		property="og:description"
		content="Book a 30-minute discovery call to discuss your team's AI adoption."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Book a Discovery Call | AI Infrastructure Help | DomeWorks" />
	<meta
		name="twitter:description"
		content="Book a 30-minute discovery call to discuss your team's AI adoption."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />
</svelte:head>

<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<div class="relative max-w-2xl mx-auto px-6 lg:px-8">
		<div class="text-center mb-12">
			<h1
				class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]"
			>
				Let's talk<span class="text-primary">.</span>
			</h1>
			<p class="mt-4 text-lg text-charcoal/70">
				30 minutes on a call and I can tell you whether your team's AI situation is something I can
				help with.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<!-- Book a Call -->
			<div class="p-8 bg-warm-white rounded-2xl border-2 border-primary flex flex-col">
				<h2 class="text-xl font-medium text-charcoal mb-3">Book a call</h2>
				<p class="text-charcoal/70 mb-6 flex-grow">
					The best way to start. 30-minute discovery call, no obligation. I'll ask about your team,
					your tools, and where things are stuck.
				</p>
				<Button href={getBookCallUrl()} size="lg">Book a discovery call</Button>
			</div>

			<!-- Send an Email -->
			<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10 flex flex-col">
				<h2 class="text-xl font-medium text-charcoal mb-3">Send an email</h2>
				<p class="text-charcoal/70 mb-6 flex-grow">
					Prefer email? Tell me about your team and I'll get back within 24 hours.
				</p>
				<Button href={generateGeneralMailto()} variant="secondary" size="lg">Send an email</Button>
			</div>
		</div>

		<!-- What happens on the call -->
		<div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 text-sm text-charcoal/70">
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
					>1</span
				>
				<span>You tell me about your team</span>
			</div>
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
					>2</span
				>
				<span>I share 2–3 observations</span>
			</div>
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
					>3</span
				>
				<span>We figure out if there's a fit</span>
			</div>
		</div>

		<!-- What to Expect -->
		<div class="mt-8 p-8 bg-stone rounded-2xl">
			<h2 class="text-lg font-medium text-charcoal mb-4">What to expect</h2>
			<p class="text-charcoal/70 leading-[1.65]">
				On the call, I'll ask about your team size, what AI tools you're using, and where things are
				stuck. I'll share 2-3 observations about where you might have leverage. If there's a fit,
				I'll recommend where to start — usually an <a
					href="/scan/"
					class="text-primary hover:underline">AI Scan</a
				>
				($2,500) if you need a clear picture first, or a
				<a href="/context-build/" class="text-primary hover:underline">Context Build</a> ($10,000+) if
				the gaps are already clear. If there isn't a fit, I'll tell you that too.
			</p>
		</div>
	</div>
</section>

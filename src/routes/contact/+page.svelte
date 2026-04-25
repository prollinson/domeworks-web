<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import { getBookCallUrl, generateGeneralMailto } from '$lib/utils/mailto';
</script>

<SEO
	title="Book a Discovery Call | AI Infrastructure Help | DomeWorks"
	description="Book a 30-minute discovery call to discuss your team's AI adoption. I'll ask about your team, your tools, and where things are stuck."
/>

<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl mx-auto text-center">
		<Eyebrow label="Contact" tone="accent-light" as="p" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Let's talk<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-4 font-serif text-lg text-paper/80 leading-[1.65]">
			30 minutes on a call and I can tell you whether your team's AI situation is something I can
			help with.
		</p>
	</div>
</Section>

<Section background="white" padding="lg">
	<div class="max-w-4xl mx-auto">
		<HairlineGrid cols={2}>
			<div class="cell flex flex-col">
				<h2 class="text-xl font-medium text-ink mb-3">Book a call</h2>
				<p class="font-serif text-muted mb-6 flex-grow leading-[1.55]">
					The best way to start. 30-minute discovery call, no obligation. I'll ask about your team,
					your tools, and where things are stuck.
				</p>
				<div>
					<Button href={getBookCallUrl()} size="lg">Book a discovery call</Button>
				</div>
			</div>
			<div class="cell flex flex-col">
				<h2 class="text-xl font-medium text-ink mb-3">Send an email</h2>
				<p class="font-serif text-muted mb-6 flex-grow leading-[1.55]">
					Prefer email? Tell me about your team and I'll get back within 24 hours.
				</p>
				<div>
					<Button href={generateGeneralMailto()} variant="secondary" size="lg">Send an email</Button
					>
				</div>
			</div>
		</HairlineGrid>

		<div
			class="mt-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 text-sm text-muted"
		>
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent"
					>1</span
				>
				<span>You tell me about your team</span>
			</div>
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent"
					>2</span
				>
				<span>I share 2–3 observations</span>
			</div>
			<div
				class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
			>
				<span
					class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent"
					>3</span
				>
				<span>We figure out if there's a fit</span>
			</div>
		</div>

		<div class="mt-12 max-w-3xl mx-auto">
			<Callout variant="rule-left">
				<h2 class="text-lg font-medium text-ink mb-4">What to expect</h2>
				<p class="font-serif text-muted leading-[1.65]">
					On the call, I'll ask about your team size, what AI tools you're using, and where things
					are stuck. I'll share 2–3 observations about where you might have leverage. If there's a
					fit, I'll recommend where to start — usually an <a
						href="/leaders/scan/"
						class="text-accent hover:underline">AI Scan</a
					>
					($2,500) if you need a clear picture first, or a
					<a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a> ($10,000+)
					if the gaps are already clear. If there isn't a fit, I'll tell you that too.
				</p>
			</Callout>
		</div>
	</div>
</Section>

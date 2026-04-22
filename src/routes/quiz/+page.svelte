<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateQuizMailto, type QuizAnswers } from '$lib/utils/mailto';
	import { getAssessmentCallUrl } from '$lib/utils/mailto';

	let industry = $state('');
	let size = $state('');
	let revenue = $state('');
	let role = $state('');
	let timeLeak = $state('');
	let dreadedTask = $state('');
	let aiUsage = $state('');
	let email = $state('');

	let submitted = $state(false);
	let submitState = $state<'idle' | 'sending' | 'sent' | 'mailto-fallback'>('idle');

	const canSubmit = $derived(
		industry && size && revenue && role && timeLeak && dreadedTask.trim().length > 2 && aiUsage && /^\S+@\S+\.\S+$/.test(email)
	);

	const icpVerdict = $derived.by(() => {
		if (!size || !revenue) return '';
		const small = size === '1-9' || revenue === 'under-1m';
		const large = size === '200+' || revenue === 'over-50m' || size === '51-200' || revenue === '10-50m';
		if (small) return 'below-core';
		if (large) return 'above-core';
		return 'in-core';
	});

	const previewCategory = $derived.by(() => {
		switch (timeLeak) {
			case 'admin': return {
				title: 'Admin drag',
				body: "The usual quick wins here start with templated intake, document chasing, and invoice follow-up. You're probably losing 3 to 5 hours a week to back-and-forth that a tool can absorb."
			};
			case 'marketing': return {
				title: 'Marketing and lead response',
				body: "Speed-to-lead is the single highest-leverage pattern I find in owner-operated businesses. Cutting your first-response time from hours to minutes is often worth more than every other quick win combined."
			};
			case 'delivery': return {
				title: 'Client delivery',
				body: "Usual quick wins here start with meeting-notes capture, draft generation for recurring deliverables, and prep work before client calls. 30 to 60 minutes per client interaction typically recoverable."
			};
			default: return {
				title: 'Mixed',
				body: "The Action Plan will map your biggest specific leak and give you three quick wins to start with."
			};
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		const answers: QuizAnswers = { industry, size, revenue, role, timeLeak, dreadedTask, aiUsage, email };
		submitted = true;
		submitState = 'sending';

		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(answers)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			submitState = 'sent';
		} catch {
			// Fall back to opening the user's mail client with the answers prefilled.
			submitState = 'mailto-fallback';
			window.location.href = generateQuizMailto(answers);
		}
	}

	function resend() {
		const answers: QuizAnswers = { industry, size, revenue, role, timeLeak, dreadedTask, aiUsage, email };
		window.location.href = generateQuizMailto(answers);
	}
</script>

<svelte:head>
	<title>AI Readiness Quiz | DomeWorks</title>
	<meta
		name="description"
		content="2-minute quiz to pinpoint your biggest time leak across admin, marketing, and delivery. Free personalized Action Plan delivered to your inbox."
	/>
	<link rel="canonical" href="https://domeworks.tech/quiz/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/quiz/" />
	<meta property="og:title" content="AI Readiness Quiz | DomeWorks" />
	<meta
		property="og:description"
		content="2 minutes. Pinpoint your biggest time leak. Get a free Action Plan in your inbox."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="AI Readiness Quiz | DomeWorks" />
	<meta
		name="twitter:description"
		content="2 minutes. Pinpoint your biggest time leak. Get a free Action Plan in your inbox."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />
</svelte:head>

<!-- Hero -->
<section class="relative bg-ink overflow-hidden -mt-16 md:-mt-20" aria-label="AI Readiness Quiz">
	<div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
	<div class="absolute inset-0 hero-glow" aria-hidden="true" role="presentation"></div>
	<div class="absolute inset-0 texture-grain" aria-hidden="true" role="presentation"></div>

	<div class="relative w-full max-w-4xl mx-auto px-6 lg:px-8 pt-36 md:pt-40 pb-16 md:pb-20">
		<div class="hero-eyebrow-row mb-6">
			<span class="hero-eyebrow-text">AI Readiness Quiz</span>
			<span class="hero-eyebrow-index">Free · 2 minutes</span>
		</div>

		<h1 class="font-serif font-normal text-warm-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
			2 minutes. <span class="text-warm-white/70">Find your biggest</span> <br class="hidden sm:block" />
			<em class="text-copper not-italic">time leak</em><span class="text-copper">.</span>
		</h1>
		<p class="text-warm-white/80 text-lg leading-relaxed max-w-2xl">
			A short set of questions to map where admin, marketing, and delivery are costing you the most time right now. I'll send a free personalized Action Plan to your inbox within 24 hours. Quick wins you can set up in 30 to 60 minutes. Step-by-step. No technical background required.
		</p>
	</div>
</section>

<!-- The quiz -->
<Section background="white" padding="md">
	{#if !submitted}
		<form onsubmit={handleSubmit} class="max-w-2xl mx-auto space-y-8" use:reveal>
			<!-- Question 1: Industry -->
			<div>
				<label for="industry" class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">01 &nbsp; What does your business do?</label>
				<select id="industry" bind:value={industry} required class="w-full p-3 bg-warm-white border border-charcoal/15 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-copper">
					<option value="">Select one</option>
					<option value="Accounting or bookkeeping">Accounting or bookkeeping</option>
					<option value="Legal">Legal</option>
					<option value="Medical or dental">Medical or dental</option>
					<option value="Trades or field services">Trades or field services (HVAC, plumbing, landscaping, etc.)</option>
					<option value="Real estate">Real estate</option>
					<option value="Marketing or creative agency">Marketing or creative agency</option>
					<option value="Consulting">Consulting</option>
					<option value="E-commerce">E-commerce</option>
					<option value="Other professional services">Other professional services</option>
				</select>
			</div>

			<!-- Question 2: Size -->
			<fieldset>
				<legend class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">02 &nbsp; How many people are on your team?</legend>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['1-9','1–9'],['10-25','10–25'],['26-50','26–50'],['51-200','51–200'],['200+','200+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={size} value={v} class="peer sr-only" required />
							<span class="block text-center p-3 bg-warm-white border border-charcoal/15 rounded-lg text-sm text-charcoal/80 peer-checked:border-copper peer-checked:bg-copper/10 peer-checked:text-charcoal hover:border-charcoal/30 transition">{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 3: Revenue -->
			<fieldset>
				<legend class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">03 &nbsp; Annual revenue range?</legend>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['under-1m','Under $1M'],['1-3m','$1–3M'],['3-10m','$3–10M'],['10-50m','$10–50M'],['over-50m','$50M+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={revenue} value={v} class="peer sr-only" required />
							<span class="block text-center p-3 bg-warm-white border border-charcoal/15 rounded-lg text-sm text-charcoal/80 peer-checked:border-copper peer-checked:bg-copper/10 peer-checked:text-charcoal hover:border-charcoal/30 transition">{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 4: Role -->
			<fieldset>
				<legend class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">04 &nbsp; Your role?</legend>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{#each ['Owner','Partner','Operations','Other'] as option}
						<label class="cursor-pointer">
							<input type="radio" bind:group={role} value={option} class="peer sr-only" required />
							<span class="block text-center p-3 bg-warm-white border border-charcoal/15 rounded-lg text-sm text-charcoal/80 peer-checked:border-copper peer-checked:bg-copper/10 peer-checked:text-charcoal hover:border-charcoal/30 transition">{option}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 5: Time leak area -->
			<fieldset>
				<legend class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">05 &nbsp; Where does your time leak most?</legend>
				<div class="space-y-2">
					{#each [
						['admin', 'Admin', 'Invoicing, scheduling, email triage, document chasing.'],
						['marketing', 'Marketing and lead response', 'Inbound lead follow-up, content cadence, quoting, proposals.'],
						['delivery', 'Client delivery', 'Meeting prep and notes, recurring deliverables, reporting, handoffs.'],
						['mixed', 'Not sure / mixed', "It's scattered. I want help seeing where to look first."]
					] as [v, title, body]}
						<label class="cursor-pointer block">
							<input type="radio" bind:group={timeLeak} value={v} class="peer sr-only" required />
							<div class="p-4 bg-warm-white border border-charcoal/15 rounded-lg peer-checked:border-copper peer-checked:bg-copper/10 hover:border-charcoal/30 transition">
								<p class="font-medium text-charcoal">{title}</p>
								<p class="text-sm text-charcoal/65 mt-1">{body}</p>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 6: Dreaded task -->
			<div>
				<label for="dreadedTask" class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">06 &nbsp; Which single task do you dread most?</label>
				<textarea
					id="dreadedTask"
					bind:value={dreadedTask}
					placeholder="The specific task on your weekly list that you procrastinate. One or two sentences."
					rows="3"
					required
					class="w-full p-3 bg-warm-white border border-charcoal/15 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-copper"
				></textarea>
			</div>

			<!-- Question 7: AI usage -->
			<fieldset>
				<legend class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">07 &nbsp; AI tool usage so far?</legend>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
					{#each [['none','Never used any'],['light','Tried ChatGPT a few times'],['regular','Regular user of one or more']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={aiUsage} value={v} class="peer sr-only" required />
							<span class="block text-center p-3 bg-warm-white border border-charcoal/15 rounded-lg text-sm text-charcoal/80 peer-checked:border-copper peer-checked:bg-copper/10 peer-checked:text-charcoal hover:border-charcoal/30 transition">{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Email -->
			<div>
				<label for="email" class="block text-sm font-semibold tracking-widest text-copper uppercase mb-3">08 &nbsp; Where should I send your Action Plan?</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@yourcompany.com"
					required
					class="w-full p-3 bg-warm-white border border-charcoal/15 rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-copper"
				/>
				<p class="mt-2 text-xs text-charcoal/55">I'll send your personalized Action Plan within 24 hours. No list. No spam. No upsell in the plan. If the honest answer for any part of your situation is "don't use AI here," the plan will say so.</p>
			</div>

			<!-- Submit -->
			<div class="pt-4">
				<button
					type="submit"
					disabled={!canSubmit}
					class="inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-[0_4px_14px_-2px_rgba(13,107,99,0.35)] px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{canSubmit ? 'Send me my Action Plan' : 'Complete all questions to submit'}
				</button>
				<p class="mt-3 text-xs text-charcoal/55">Clicking send opens your email client with your answers filled in. Hit send in that window to deliver the quiz to me.</p>
			</div>
		</form>
	{:else}
		<!-- Post-submit state: preview + instructions -->
		<div class="max-w-2xl mx-auto space-y-6" use:reveal>
			{#if submitState === 'sending'}
				<div class="p-6 bg-stone rounded-xl border border-charcoal/10">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-3">Sending</p>
					<h2 class="font-serif text-2xl text-charcoal mb-3">Submitting your answers.</h2>
					<p class="text-charcoal/75 leading-relaxed">One moment.</p>
				</div>
			{:else if submitState === 'sent'}
				<div class="p-6 bg-copper/[0.08] rounded-xl border border-copper/25">
					<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-3">Received</p>
					<h2 class="font-serif text-2xl text-charcoal mb-3">Thanks. Your Action Plan is on the way.</h2>
					<p class="text-charcoal/75 leading-relaxed">
						I got your answers and I'll email a personalized Action Plan to <strong class="text-charcoal">{email}</strong> within 24 hours. No list. No spam.
					</p>
				</div>
			{:else}
				<!-- mailto-fallback: browser POST failed, mail client opened instead -->
				<div class="p-6 bg-copper/[0.08] rounded-xl border border-copper/25">
					<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-3">One more step</p>
					<h2 class="font-serif text-2xl text-charcoal mb-3">Check the email window that just opened.</h2>
					<p class="text-charcoal/75 leading-relaxed">
						Automatic submission didn't work so your mail client opened with your answers pre-filled. Hit send in that window and I'll email your personalized Action Plan within 24 hours.
					</p>
					<button type="button" onclick={resend} class="mt-4 text-sm text-copper underline">
						Didn't see an email window? Click here to try again.
					</button>
				</div>
			{/if}

			<!-- Live preview of what's coming -->
			<div class="p-6 bg-stone rounded-xl border border-charcoal/10">
				<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-2">Preview · based on your answers</p>
				<h3 class="font-medium text-charcoal mb-2">Your category: {previewCategory.title}</h3>
				<p class="text-sm text-charcoal/75 leading-relaxed">{previewCategory.body}</p>
			</div>

			<!-- ICP verdict -->
			{#if icpVerdict === 'in-core'}
				<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
					<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Good fit</p>
					<p class="text-charcoal/75 leading-relaxed">
						You're squarely in the size I work with most. If the Action Plan lands and you want to go further, the full <a href="/ai-tools-assessment/" class="text-copper underline">AI Tools Assessment</a> is the natural next step.
					</p>
				</div>
			{:else if icpVerdict === 'below-core'}
				<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-2">Heads up</p>
					<p class="text-charcoal/75 leading-relaxed">
						Your size is a touch below the teams I work with on paid engagements, but the Action Plan will still give you concrete quick wins. No pitch, no follow-up pressure.
					</p>
				</div>
			{:else if icpVerdict === 'above-core'}
				<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
					<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Different track</p>
					<p class="text-charcoal/75 leading-relaxed">
						You're above my owner-operator Assessment track. The <a href="/scan/" class="text-copper underline">AI Scan</a> is probably a better fit at your scale. I'll mention that in the Action Plan too.
					</p>
				</div>
			{/if}
		</div>
	{/if}
</Section>

<!-- What the Action Plan includes -->
{#if !submitted}
<Section background="muted" padding="md" eyebrow="What you get" title="The Action Plan">
	<div class="max-w-4xl mx-auto grid md:grid-cols-3 gap-5" use:reveal>
		<div class="p-5 bg-warm-white rounded-xl border border-charcoal/10">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">01</p>
			<h3 class="font-medium text-charcoal mb-2">Three personalized quick wins</h3>
			<p class="text-sm text-charcoal/70 leading-relaxed">
				Ranked by time saved vs. setup effort. Each is specific to the leak you named, not a generic top-10 list.
			</p>
		</div>
		<div class="p-5 bg-warm-white rounded-xl border border-charcoal/10">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">02</p>
			<h3 class="font-medium text-charcoal mb-2">Step-by-step instructions</h3>
			<p class="text-sm text-charcoal/70 leading-relaxed">
				Each win comes with setup instructions a non-technical person can follow in 30 to 60 minutes. No developer required.
			</p>
		</div>
		<div class="p-5 bg-warm-white rounded-xl border border-charcoal/10">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">03</p>
			<h3 class="font-medium text-charcoal mb-2">What to leave alone</h3>
			<p class="text-sm text-charcoal/70 leading-relaxed">
				If part of your answer points at a workflow where AI is the wrong tool, the plan names it and says so plainly. No pretending.
			</p>
		</div>
	</div>

	<div class="max-w-4xl mx-auto mt-10 text-center">
		<p class="text-sm text-charcoal/60">
			Already know you want the full diagnostic? <a href={getAssessmentCallUrl()} class="text-copper underline">Book the AI Tools Assessment discovery call</a> instead.
		</p>
	</div>
</Section>
{/if}

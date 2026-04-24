<script lang="ts">
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
		industry &&
			size &&
			revenue &&
			role &&
			timeLeak &&
			dreadedTask.trim().length > 2 &&
			aiUsage &&
			/^\S+@\S+\.\S+$/.test(email)
	);

	const icpVerdict = $derived.by(() => {
		if (!size || !revenue) return '';
		const small = size === '1-9' || revenue === 'under-1m';
		const large =
			size === '200+' || revenue === 'over-50m' || size === '51-200' || revenue === '10-50m';
		if (small) return 'below-core';
		if (large) return 'above-core';
		return 'in-core';
	});

	const previewCategory = $derived.by(() => {
		switch (timeLeak) {
			case 'admin':
				return {
					title: 'Admin drag',
					body: "The usual quick wins here start with templated intake, document chasing, and invoice follow-up. You're probably losing 3 to 5 hours a week to back-and-forth that a tool can absorb."
				};
			case 'marketing':
				return {
					title: 'Marketing and lead response',
					body: 'Speed-to-lead is the single highest-leverage pattern I find in owner-operated businesses. Cutting your first-response time from hours to minutes is often worth more than every other quick win combined.'
				};
			case 'delivery':
				return {
					title: 'Client delivery',
					body: 'Usual quick wins here start with meeting-notes capture, draft generation for recurring deliverables, and prep work before client calls. 30 to 60 minutes per client interaction typically recoverable.'
				};
			default:
				return {
					title: 'Mixed',
					body: 'The Action Plan will map your biggest specific leak and give you three quick wins to start with.'
				};
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		const answers: QuizAnswers = {
			industry,
			size,
			revenue,
			role,
			timeLeak,
			dreadedTask,
			aiUsage,
			email
		};
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
		const answers: QuizAnswers = {
			industry,
			size,
			revenue,
			role,
			timeLeak,
			dreadedTask,
			aiUsage,
			email
		};
		window.location.href = generateQuizMailto(answers);
	}

	const questions = [
		{ n: '01', label: 'What does your business do?' },
		{ n: '02', label: 'How many people are on your team?' },
		{ n: '03', label: 'Annual revenue range?' },
		{ n: '04', label: 'Your role?' },
		{ n: '05', label: 'Where does your time leak most?' },
		{ n: '06', label: 'Which single task do you dread most?' },
		{ n: '07', label: 'AI tool usage so far?' },
		{ n: '08', label: 'Where should I send your Action Plan?' }
	];

	// Shared classes for radio/checkbox chip controls.
	const chipClass =
		'block text-center p-3 bg-paper border border-rule rounded-lg text-sm font-sans text-muted peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-ink hover:border-ink/30 transition';
	const cardChipClass =
		'p-4 bg-paper border border-rule rounded-lg peer-checked:border-accent peer-checked:bg-accent/10 hover:border-ink/30 transition';
	const inputClass =
		'w-full p-3 bg-paper border border-rule rounded-lg text-ink font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent';
</script>

<svelte:head>
	<title>AI Readiness Quiz | DomeWorks</title>
	<meta
		name="description"
		content="2-minute quiz to pinpoint your biggest time leak across admin, marketing, and delivery. Free personalized Action Plan delivered to your inbox."
	/>
	<link rel="canonical" href="https://domeworks.tech/smb/quiz/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/smb/quiz/" />
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

<!-- Hero: dark ink surface, sans semibold H1, editorial eyebrow row -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="AI Readiness Quiz">
	<a
		href="/"
		class="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 text-sm font-sans font-semibold tracking-tight text-paper/80 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
	>
		DomeWorks<span class="text-accent-light">.</span>
	</a>

	<div class="relative w-full max-w-4xl mx-auto px-6 lg:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-8"
		>
			<span class="text-accent-light">AI Readiness Quiz</span>
			<span class="h-3 w-px bg-paper/25" aria-hidden="true"></span>
			<span class="text-paper/75 font-normal tracking-[0.08em]">Free · 2 minutes</span>
		</div>

		<h1
			class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
		>
			2 minutes. <span class="text-paper/70">Find your biggest</span>
			<br class="hidden sm:block" />
			<span class="text-accent-light">time leak.</span>
		</h1>

		<p
			class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/80 max-w-2xl font-normal"
		>
			A short set of questions to map where admin, marketing, and delivery are costing you the most
			time right now.
		</p>
		<p class="mt-4 text-sm text-paper/75 max-w-2xl">
			I'll send a free personalized Action Plan to your inbox within 24 hours. Quick wins you can
			set up in 30 to 60 minutes. Step-by-step. No technical background required.
		</p>
	</div>
</section>

<!-- The quiz -->
<Section background="white" padding="md">
	{#if !submitted}
		<form onsubmit={handleSubmit} class="max-w-2xl mx-auto space-y-10" use:reveal>
			<!-- Question 1: Industry -->
			<div>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[0].n}</p>
				<label
					for="industry"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[0].label}</label
				>
				<select id="industry" bind:value={industry} required class={inputClass}>
					<option value="">Select one</option>
					<option value="Accounting or bookkeeping">Accounting or bookkeeping</option>
					<option value="Legal">Legal</option>
					<option value="Medical or dental">Medical or dental</option>
					<option value="Trades or field services"
						>Trades or field services (HVAC, plumbing, landscaping, etc.)</option
					>
					<option value="Real estate">Real estate</option>
					<option value="Marketing or creative agency">Marketing or creative agency</option>
					<option value="Consulting">Consulting</option>
					<option value="E-commerce">E-commerce</option>
					<option value="Other professional services">Other professional services</option>
				</select>
			</div>

			<!-- Question 2: Size -->
			<fieldset>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[1].n}</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[1].label}</legend
				>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['1-9', '1–9'], ['10-25', '10–25'], ['26-50', '26–50'], ['51-200', '51–200'], ['200+', '200+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={size} value={v} class="peer sr-only" required />
							<span class={chipClass}>{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 3: Revenue -->
			<fieldset>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[2].n}</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[2].label}</legend
				>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['under-1m', 'Under $1M'], ['1-3m', '$1–3M'], ['3-10m', '$3–10M'], ['10-50m', '$10–50M'], ['over-50m', '$50M+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={revenue} value={v} class="peer sr-only" required />
							<span class={chipClass}>{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 4: Role -->
			<fieldset>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[3].n}</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[3].label}</legend
				>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{#each ['Owner', 'Partner', 'Operations', 'Other'] as option}
						<label class="cursor-pointer">
							<input type="radio" bind:group={role} value={option} class="peer sr-only" required />
							<span class={chipClass}>{option}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 5: Time leak area -->
			<fieldset>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[4].n}</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[4].label}</legend
				>
				<div class="space-y-2">
					{#each [['admin', 'Admin', 'Invoicing, scheduling, email triage, document chasing.'], ['marketing', 'Marketing and lead response', 'Inbound lead follow-up, content cadence, quoting, proposals.'], ['delivery', 'Client delivery', 'Meeting prep and notes, recurring deliverables, reporting, handoffs.'], ['mixed', 'Not sure / mixed', "It's scattered. I want help seeing where to look first."]] as [v, title, body]}
						<label class="cursor-pointer block">
							<input type="radio" bind:group={timeLeak} value={v} class="peer sr-only" required />
							<div class={cardChipClass}>
								<p class="font-sans font-medium text-ink">{title}</p>
								<p class="font-serif text-sm text-muted leading-relaxed mt-1">{body}</p>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Question 6: Dreaded task -->
			<div>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[5].n}</p>
				<label
					for="dreadedTask"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[5].label}</label
				>
				<textarea
					id="dreadedTask"
					bind:value={dreadedTask}
					placeholder="The specific task on your weekly list that you procrastinate. One or two sentences."
					rows="3"
					required
					class={inputClass}
				></textarea>
			</div>

			<!-- Question 7: AI usage -->
			<fieldset>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[6].n}</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[6].label}</legend
				>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
					{#each [['none', 'Never used any'], ['light', 'Tried ChatGPT a few times'], ['regular', 'Regular user of one or more']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={aiUsage} value={v} class="peer sr-only" required />
							<span class={chipClass}>{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Email -->
			<div>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2"
				>{questions[7].n}</p>
				<label
					for="email"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>{questions[7].label}</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@yourcompany.com"
					required
					class={inputClass}
				/>
				<p class="mt-3 font-serif text-sm text-muted leading-relaxed">
					I'll send your personalized Action Plan within 24 hours. No list. No spam. No upsell in
					the plan. If the honest answer for any part of your situation is "don't use AI here," the
					plan will say so.
				</p>
			</div>

			<!-- Submit -->
			<div class="pt-2">
				<button
					type="submit"
					disabled={!canSubmit}
					class="inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 active:scale-[0.98] bg-accent text-paper hover:bg-accent-hover shadow-sm hover:shadow hover:-translate-y-px px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
				>
					{canSubmit ? 'Send me my Action Plan' : 'Complete all questions to submit'}
				</button>
				<p class="mt-3 text-xs text-subtle">
					Clicking send opens your email client with your answers filled in. Hit send in that window
					to deliver the quiz to me.
				</p>
			</div>
		</form>
	{:else}
		<!-- Post-submit state: status + preview + ICP verdict -->
		<div class="max-w-2xl mx-auto space-y-8" use:reveal>
			{#if submitState === 'sending'}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
						Sending
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Submitting your answers.
					</h2>
					<p class="font-serif text-muted leading-relaxed">One moment.</p>
				</div>
			{:else if submitState === 'sent'}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Received
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Thanks. Your Action Plan is on the way.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						I got your answers and I'll email a personalized Action Plan to <strong
							class="font-sans font-medium text-ink">{email}</strong
						> within 24 hours. No list. No spam.
					</p>
				</div>
			{:else}
				<!-- mailto-fallback: browser POST failed, mail client opened instead -->
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						One more step
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Check the email window that just opened.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						Automatic submission didn't work so your mail client opened with your answers
						pre-filled. Hit send in that window and I'll email your personalized Action Plan within
						24 hours.
					</p>
					<button
						type="button"
						onclick={resend}
						class="mt-4 text-sm font-sans text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						Didn't see an email window? Click here to try again.
					</button>
				</div>
			{/if}

			<!-- Live preview of what's coming -->
			<div class="border-t border-rule pt-8">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Preview · based on your answers
				</p>
				<h3 class="font-sans font-medium text-lg text-ink tracking-tight mb-2">
					Your category: {previewCategory.title}
				</h3>
				<p class="font-serif text-muted leading-relaxed">{previewCategory.body}</p>
			</div>

			<!-- ICP verdict -->
			{#if icpVerdict === 'in-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Good fit
					</p>
					<p class="font-serif text-muted leading-relaxed">
						You're squarely in the size I work with most. If the Action Plan lands and you want to
						go further, the full <a
							href="/smb/"
							class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
							>AI Tools Assessment</a
						> is the natural next step.
					</p>
				</div>
			{:else if icpVerdict === 'below-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
						Heads up
					</p>
					<p class="font-serif text-muted leading-relaxed">
						Your size is a touch below the teams I work with on paid engagements, but the Action
						Plan will still give you concrete quick wins. No pitch, no follow-up pressure.
					</p>
				</div>
			{:else if icpVerdict === 'above-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Different track
					</p>
					<p class="font-serif text-muted leading-relaxed">
						You're above my owner-operator Assessment track. The <a
							href="/scan/"
							class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
							>AI Scan</a
						> is probably a better fit at your scale. I'll mention that in the Action Plan too.
					</p>
				</div>
			{/if}
		</div>
	{/if}
</Section>

<!-- What the Action Plan includes — hairline-grid matching the Assessment page -->
{#if !submitted}
	<Section background="muted" padding="md" eyebrow="What you get" title="The Action Plan" centered={false}>
		<div class="max-w-5xl">
			<div
				class="hairline-grid on-muted grid md:grid-cols-3"
				use:reveal={{ stagger: true, staggerDelay: 80, duration: 420 }}
			>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						01
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						Three personalized quick wins
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						Ranked by time saved vs. setup effort. Each is specific to the leak you named, not a
						generic top-10 list.
					</p>
				</div>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						02
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						Step-by-step instructions
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						Each win comes with setup instructions a non-technical person can follow in 30 to 60
						minutes. No developer required.
					</p>
				</div>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						03
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						What to leave alone
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						If part of your answer points at a workflow where AI is the wrong tool, the plan names
						it and says so plainly. No pretending.
					</p>
				</div>
			</div>

			<div class="mt-12 max-w-3xl">
				<p class="font-serif text-muted leading-relaxed">
					Already know you want the full diagnostic?
					<a
						href={getAssessmentCallUrl()}
						class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
						>Book the AI Tools Assessment discovery call</a
					> instead.
				</p>
			</div>
		</div>
	</Section>
{/if}

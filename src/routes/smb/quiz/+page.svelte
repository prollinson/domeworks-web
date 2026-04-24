<script lang="ts">
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateQuizMailto, getAssessmentCallUrl } from '$lib/utils/mailto';
	import { QUIZ_INDUSTRIES } from '$lib/data/quiz-industries';
	import { getFallbackQuestion } from '$lib/data/quiz-fallback';
	import { untrack } from 'svelte';
	import type {
		AdaptiveAnswer,
		NextRequest,
		NextResponse,
		QuizStatic,
		QuizSubmission
	} from '$lib/types/quiz';

	// --- Static answers ---
	let industry = $state('');
	let size = $state('');
	let timeLeak = $state('');
	let dreadedTask = $state('');
	let processHealth = $state<'healthy' | 'broken' | 'unsure' | ''>('');

	const staticComplete = $derived(
		industry.length > 0 &&
			size.length > 0 &&
			timeLeak.length > 0 &&
			dreadedTask.trim().length >= 20 &&
			processHealth.length > 0
	);

	// --- Adaptive state ---
	let adaptive = $state<AdaptiveAnswer[]>([]);
	let pendingQuestion = $state<NextResponse | null>(null);
	let loadingNext = $state(false);
	let otherText = $state('');
	let selectedOption = $state('');
	// Monotonic version — bumped when static changes, so stale fetches can be discarded.
	let staticVersion = $state(0);

	// --- Submit state ---
	let email = $state('');
	let submitted = $state(false);
	let submitState = $state<'idle' | 'sending' | 'sent' | 'mailto-fallback'>('idle');

	const canSubmit = $derived(
		staticComplete && adaptive.length === 3 && /^\S+@\S+\.\S+$/.test(email)
	);

	// --- Reset adaptive when any static field changes ---
	$effect(() => {
		// Depend on each static field so Svelte tracks edits.
		industry;
		size;
		timeLeak;
		dreadedTask;
		processHealth;
		// Use untrack so staticVersion++ doesn't add staticVersion as a reactive
		// dependency of this effect (which would cause an infinite re-run loop).
		untrack(() => {
			staticVersion++;
		});
		adaptive = [];
		pendingQuestion = null;
		selectedOption = '';
		otherText = '';
		// Clear any in-flight flag too — without this, an edit during a pending
		// fetch leaves loadingNext stuck true and wedges the next blur trigger.
		loadingNext = false;
	});

	// --- Fetch next adaptive question ---
	async function fetchNext() {
		if (!staticComplete) return;
		if (adaptive.length >= 3) return;
		if (pendingQuestion) return;
		if (loadingNext) return;

		loadingNext = true;
		const myVersion = staticVersion;

		const body: NextRequest = {
			static: {
				industry,
				size,
				timeLeak,
				dreadedTask: dreadedTask.trim(),
				processHealth: processHealth as 'healthy' | 'broken' | 'unsure'
			} satisfies QuizStatic,
			adaptiveSoFar: adaptive
		};

		try {
			const res = await fetch('/api/quiz/next', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(8000)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = (await res.json()) as NextResponse;
			if (myVersion !== staticVersion) return; // stale
			pendingQuestion = data;
		} catch (err) {
			if (myVersion !== staticVersion) return;
			console.warn('[adaptive-quiz] /api/quiz/next failed, using fallback:', err);
			pendingQuestion = getFallbackQuestion(adaptive.length);
		} finally {
			if (myVersion === staticVersion) loadingNext = false;
		}
	}

	// Fire the first adaptive fetch once all five static answers exist.
	// queueMicrotask defers the call out of the effect flush pass.
	$effect(() => {
		if (staticComplete && adaptive.length === 0 && !pendingQuestion && !loadingNext) {
			queueMicrotask(fetchNext);
		}
	});

	// --- Answering an adaptive question ---
	function answerPending() {
		if (!pendingQuestion) return;
		const answer =
			selectedOption === 'Other' && otherText.trim().length > 0
				? `Other: ${otherText.trim()}`
				: selectedOption;
		if (!answer) return;

		adaptive = [
			...adaptive,
			{
				id: pendingQuestion.id,
				infoNeed: pendingQuestion.infoNeed,
				question: pendingQuestion.question,
				options: pendingQuestion.options,
				answer
			}
		];
		pendingQuestion = null;
		selectedOption = '';
		otherText = '';

		if (adaptive.length < 3) fetchNext();
	}

	// --- Submit ---
	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;

		const submission: QuizSubmission = {
			static: {
				industry,
				size,
				timeLeak,
				dreadedTask: dreadedTask.trim(),
				processHealth: processHealth as 'healthy' | 'broken' | 'unsure'
			},
			adaptive,
			email
		};

		submitted = true;
		submitState = 'sending';

		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(submission)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			submitState = 'sent';
		} catch {
			submitState = 'mailto-fallback';
			window.location.href = generateQuizMailto(submission);
		}
	}

	function resend() {
		const submission: QuizSubmission = {
			static: {
				industry,
				size,
				timeLeak,
				dreadedTask: dreadedTask.trim(),
				processHealth: processHealth as 'healthy' | 'broken' | 'unsure'
			},
			adaptive,
			email
		};
		window.location.href = generateQuizMailto(submission);
	}

	// --- Derivations for post-submit preview ---
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

	const icpVerdict = $derived.by(() => {
		if (!size) return '';
		if (size === '1-9') return 'below-core';
		if (size === '51-200' || size === '200+') return 'above-core';
		return 'in-core';
	});

	// Shared classes (preserved from the prior file).
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
		content="2-minute quiz to pinpoint your biggest time leak. Free personalised Action Plan delivered to your inbox."
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

<!-- Hero -->
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
			I'll send a free personalised Action Plan to your inbox within 24 hours. Quick wins you can
			set up in 30 to 60 minutes. Step-by-step. No technical background required.
		</p>
	</div>
</section>

<!-- The quiz -->
<Section background="white" padding="md">
	{#if !submitted}
		<form onsubmit={handleSubmit} class="max-w-2xl mx-auto space-y-10" use:reveal>
			<!-- Q01 Industry -->
			<div>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					01
				</p>
				<label
					for="industry"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
				>
					What does your business do?
				</label>
				<select id="industry" bind:value={industry} required class={inputClass}>
					<option value="">Select one</option>
					{#each QUIZ_INDUSTRIES as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<!-- Q02 Size -->
			<fieldset>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					02
				</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
					How many people are on your team?
				</legend>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['1-9', '1–9'], ['10-25', '10–25'], ['26-50', '26–50'], ['51-200', '51–200'], ['200+', '200+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={size} value={v} class="peer sr-only" required />
							<span class={chipClass}>{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Q03 Time leak -->
			<fieldset>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					03
				</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
					Where does your time leak most?
				</legend>
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

			<!-- Q04 Dreaded task -->
			<div>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					04
				</p>
				<label
					for="dreadedTask"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
				>
					Which single task do you dread most?
				</label>
				<textarea
					id="dreadedTask"
					bind:value={dreadedTask}
					placeholder="One concrete task, with numbers if possible. E.g. 'chasing 15 client docs every tax season, ~6 hrs/week'."
					rows="3"
					required
					class={inputClass}
				></textarea>
				{#if dreadedTask.trim().length > 0 && dreadedTask.trim().length < 20}
					<p class="mt-2 text-xs text-subtle">
						A little more detail helps me write a sharper plan.
					</p>
				{/if}
			</div>

			<!-- Q05 Process health -->
			<fieldset>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					05
				</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
					Which is closer to the truth about that task?
				</legend>
				<div class="space-y-2">
					{#each [['healthy', 'The process works', 'The task itself just eats time. The workflow around it is fine.'], ['broken', 'The process is broken', "That's where the real problem is. The task being painful is a symptom."], ['unsure', 'Honestly, not sure', 'Maybe a bit of both. Help me think about it.']] as [v, title, body]}
						<label class="cursor-pointer block">
							<input
								type="radio"
								bind:group={processHealth}
								value={v}
								class="peer sr-only"
								required
							/>
							<div class={cardChipClass}>
								<p class="font-sans font-medium text-ink">{title}</p>
								<p class="font-serif text-sm text-muted leading-relaxed mt-1">{body}</p>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Q06-Q08 Adaptive answered -->
			{#each adaptive as a, i (a.id)}
				<fieldset disabled>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						{String(i + 6).padStart(2, '0')}
					</p>
					<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
						{a.question}
					</legend>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{#each a.options as opt (opt)}
							<label class="cursor-pointer">
								<input
									type="radio"
									checked={a.answer === opt || (opt === 'Other' && a.answer.startsWith('Other: '))}
									class="peer sr-only"
								/>
								<span class={chipClass}>{opt}</span>
							</label>
						{/each}
					</div>
					{#if a.answer.startsWith('Other: ')}
						<p class="mt-2 font-serif text-sm text-muted">
							You typed: {a.answer.replace('Other: ', '')}
						</p>
					{/if}
				</fieldset>
			{/each}

			<!-- Pending adaptive question -->
			{#if adaptive.length < 3 && (loadingNext || pendingQuestion)}
				<fieldset>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						{String(adaptive.length + 6).padStart(2, '0')} · Based on your answers
					</p>
					{#if loadingNext && !pendingQuestion}
						<div class="space-y-3" aria-busy="true">
							<div class="h-6 w-3/4 bg-rule/60 rounded animate-pulse"></div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{#each [0, 1, 2] as i (i)}
									<div class="h-12 bg-rule/40 rounded-lg animate-pulse"></div>
								{/each}
							</div>
						</div>
					{:else if pendingQuestion}
						<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
							{pendingQuestion.question}
						</legend>
						{#if pendingQuestion.helper}
							<p class="font-serif text-sm text-muted leading-relaxed mb-3">
								{pendingQuestion.helper}
							</p>
						{/if}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{#each pendingQuestion.options as opt (opt)}
								<label class="cursor-pointer">
									<input
										type="radio"
										bind:group={selectedOption}
										value={opt}
										class="peer sr-only"
									/>
									<span class={chipClass}>{opt}</span>
								</label>
							{/each}
						</div>
						{#if selectedOption === 'Other'}
							<input
								type="text"
								bind:value={otherText}
								placeholder="Type your answer"
								class="{inputClass} mt-3"
								maxlength="200"
							/>
						{/if}
						<div class="mt-4">
							<button
								type="button"
								onclick={answerPending}
								disabled={!selectedOption ||
									(selectedOption === 'Other' && otherText.trim().length === 0)}
								class="inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 active:scale-[0.98] bg-ink text-paper hover:bg-ink/90 shadow-sm hover:shadow px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Next →
							</button>
						</div>
					{/if}
				</fieldset>
			{/if}

			<!-- Q09 Email (only after 3 adaptive answers) -->
			{#if adaptive.length === 3}
				<div>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						09
					</p>
					<label
						for="email"
						class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>
						Where should I send your Action Plan?
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@yourcompany.com"
						required
						class={inputClass}
					/>
					<p class="mt-3 font-serif text-sm text-muted leading-relaxed">
						I'll send your personalised Action Plan within 24 hours. No list. No spam. No upsell in
						the plan. If the honest answer for any part of your situation is "don't use AI here,"
						the plan will say so.
					</p>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						disabled={!canSubmit}
						class="inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 active:scale-[0.98] bg-accent text-paper hover:bg-accent-hover shadow-sm hover:shadow hover:-translate-y-px px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
					>
						{canSubmit ? 'Send me my Action Plan' : 'Enter your email to submit'}
					</button>
					<p class="mt-3 text-xs text-subtle">
						If automatic submission fails, your email client opens with the answers pre-filled.
					</p>
				</div>
			{/if}
		</form>
	{:else}
		<!-- Post-submit state -->
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
						I got your answers and I'll email a personalised Action Plan to
						<strong class="font-sans font-medium text-ink">{email}</strong>
						within 24 hours. No list. No spam.
					</p>
				</div>
			{:else}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						One more step
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Check the email window that just opened.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						Automatic submission didn't work so your mail client opened with your answers
						pre-filled. Hit send in that window and I'll email your personalised Action Plan within
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

			<div class="border-t border-rule pt-8">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Preview · based on your answers
				</p>
				<h3 class="font-sans font-medium text-lg text-ink tracking-tight mb-2">
					Your category: {previewCategory.title}
				</h3>
				<p class="font-serif text-muted leading-relaxed">{previewCategory.body}</p>
			</div>

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

{#if !submitted}
	<Section
		background="muted"
		padding="md"
		eyebrow="What you get"
		title="The Action Plan"
		centered={false}
	>
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
						Three personalised quick wins
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

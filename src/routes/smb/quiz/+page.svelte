<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import QuizResultView from '$lib/components/smb/QuizResultView.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateQuizMailto, getAssessmentCallUrl } from '$lib/utils/mailto';
	import { QUIZ_INDUSTRIES } from '$lib/data/quiz-industries';
	import { getFallbackQuestion } from '$lib/data/quiz-fallback';
	import { posthog } from '$lib/posthog';
	import { untrack } from 'svelte';
	import type {
		AdaptiveAnswer,
		GovernanceComfort,
		GovernanceReview,
		GovernanceRules,
		NextRequest,
		NextResponse,
		QuizStatic,
		QuizSubmission,
		RegulatedData
	} from '$lib/types/quiz';

	const REGULATED_INDUSTRIES = new Set([
		'Accounting or bookkeeping',
		'Legal',
		'Medical or dental',
		'Mortgage broker / lending',
		'Insurance or brokers'
	]);

	const BUSINESS_GOALS = [
		'Grow revenue',
		'Add capacity without hiring',
		'Faster turnaround',
		'Better client response',
		'Reduce admin burden',
		'Improve documentation or compliance',
		'Smoother scheduling or intake',
		'Better collections or cash flow',
		'Staffing resilience',
		'Margin or profitability',
		'Other'
	];

	const DIGITIZATION_TRIGGER = /email|pdf|phone|paper|spreadsheet/i;

	// --- Static answers ---
	let industry = $state('');
	let size = $state('');
	let regulatedData = $state<RegulatedData | ''>('');
	let businessGoal = $state('');
	let businessGoalOther = $state('');
	let timeLeak = $state('');
	let dreadedTask = $state('');
	let digitizationProbe = $state('');
	let processHealth = $state<'healthy' | 'broken' | 'unsure' | ''>('');
	let currentAiUse = $state('');
	let governanceRules = $state<GovernanceRules | ''>('');
	let governanceReview = $state<GovernanceReview | ''>('');
	let governanceComfort = $state<GovernanceComfort | ''>('');

	// --- Conditional branches ---
	const governanceShown = $derived(
		(regulatedData === 'yes' || regulatedData === 'sometimes') && REGULATED_INDUSTRIES.has(industry)
	);
	const digitizationShown = $derived(
		dreadedTask.trim().length >= 20 && DIGITIZATION_TRIGGER.test(dreadedTask)
	);

	// --- Completion gates ---
	const governanceComplete = $derived(
		!governanceShown ||
			(governanceRules.length > 0 && governanceReview.length > 0 && governanceComfort.length > 0)
	);
	const businessGoalComplete = $derived(
		businessGoal.length > 0 && (businessGoal !== 'Other' || businessGoalOther.trim().length > 0)
	);

	const staticComplete = $derived(
		industry.length > 0 &&
			size.length > 0 &&
			regulatedData.length > 0 &&
			governanceComplete &&
			businessGoalComplete &&
			timeLeak.length > 0 &&
			dreadedTask.trim().length >= 20 &&
			processHealth.length > 0
	);

	// --- Adaptive state ---
	const ADAPTIVE_TARGET = 2;
	let adaptive = $state<AdaptiveAnswer[]>([]);
	let pendingQuestion = $state<NextResponse | null>(null);
	let loadingNext = $state(false);
	let otherText = $state('');
	let selectedOption = $state('');
	// Monotonic version bumped when static changes, so stale fetches can be discarded.
	let staticVersion = $state(0);

	// --- Submit state ---
	let email = $state('');
	let submitted = $state(false);
	let submitState = $state<'idle' | 'sending' | 'sent' | 'mailto-fallback'>('idle');
	let submissionId = $state<string | null>(null);

	const canSubmit = $derived(
		staticComplete && adaptive.length === ADAPTIVE_TARGET && /^\S+@\S+\.\S+$/.test(email)
	);

	// Reset adaptive when any static field changes.
	$effect(() => {
		// Touch each tracked field so Svelte records this effect's dependencies.
		void [
			industry,
			size,
			regulatedData,
			businessGoal,
			businessGoalOther,
			timeLeak,
			dreadedTask,
			digitizationProbe,
			processHealth,
			currentAiUse,
			governanceRules,
			governanceReview,
			governanceComfort
		];
		untrack(() => {
			staticVersion++;
		});
		adaptive = [];
		pendingQuestion = null;
		selectedOption = '';
		otherText = '';
		loadingNext = false;
	});

	// Clear governance answers when the branch no longer fires,
	// so stale answers don't leak into the submission.
	$effect(() => {
		if (!governanceShown) {
			untrack(() => {
				governanceRules = '';
				governanceReview = '';
				governanceComfort = '';
			});
		}
	});
	$effect(() => {
		if (!digitizationShown) {
			untrack(() => {
				digitizationProbe = '';
			});
		}
	});
	$effect(() => {
		if (businessGoal !== 'Other') {
			untrack(() => {
				businessGoalOther = '';
			});
		}
	});

	// --- PostHog funnel events ---
	// Intentionally non-reactive: mutations inside $effect should not re-trigger effects.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const firedStepEvents = new Set<string>();
	let stepTotal = $derived(
		1 /* industry */ +
			1 /* size */ +
			1 /* regulated-data */ +
			(governanceShown ? 1 : 0) +
			1 /* business-goal */ +
			1 /* time-leak */ +
			1 /* dreaded-task */ +
			1 /* process-health */ +
			1 /* current-ai-use */ +
			ADAPTIVE_TARGET
	);

	function fireStep(stepId: string) {
		if (firedStepEvents.has(stepId)) return;
		firedStepEvents.add(stepId);
		if (typeof window === 'undefined') return;
		try {
			posthog.capture('quiz_step_completed', {
				step_id: stepId,
				step_number: firedStepEvents.size,
				step_total: stepTotal
			});
		} catch {
			// PostHog blocked or unavailable; swallow so the UX doesn't notice.
		}
	}

	// Track step completions reactively. Track once per (step_id, version) so that
	// edits which clear state then re-complete it don't re-fire.
	$effect(() => {
		if (industry) fireStep('industry');
	});
	$effect(() => {
		if (size) fireStep('size');
	});
	$effect(() => {
		if (regulatedData) fireStep('regulated-data');
	});
	$effect(() => {
		if (governanceShown && governanceComplete) fireStep('governance');
	});
	$effect(() => {
		if (businessGoalComplete) fireStep('business-goal');
	});
	$effect(() => {
		if (timeLeak) fireStep('time-leak');
	});
	$effect(() => {
		if (dreadedTask.trim().length >= 20) fireStep('dreaded-task');
	});
	$effect(() => {
		if (processHealth) fireStep('process-health');
	});
	$effect(() => {
		// Current AI use is optional, so it fires once staticComplete is true
		// (meaning the user has moved past the static block, blank or not).
		if (staticComplete) fireStep('current-ai-use');
	});
	$effect(() => {
		for (let i = 0; i < adaptive.length; i++) {
			fireStep(`adaptive-${i + 1}`);
		}
	});

	onMount(() => {
		try {
			posthog.capture('quiz_started', { path: '/smb/quiz' });
		} catch {
			// swallow
		}

		const onUnload = () => {
			if (submitted) return;
			try {
				posthog.capture('quiz_abandoned', {
					last_step_id: Array.from(firedStepEvents).pop() ?? 'none',
					last_step_number: firedStepEvents.size
				});
			} catch {
				// swallow
			}
		};
		window.addEventListener('pagehide', onUnload);
		window.addEventListener('beforeunload', onUnload);
		return () => {
			window.removeEventListener('pagehide', onUnload);
			window.removeEventListener('beforeunload', onUnload);
		};
	});

	// --- Fetch next adaptive question ---
	function buildStatic(): QuizStatic {
		return {
			industry,
			size,
			regulatedData: regulatedData as RegulatedData,
			businessGoal,
			businessGoalOther: businessGoal === 'Other' ? businessGoalOther.trim() : '',
			timeLeak,
			dreadedTask: dreadedTask.trim(),
			digitizationProbe: digitizationShown ? digitizationProbe.trim() : '',
			processHealth: processHealth as 'healthy' | 'broken' | 'unsure',
			currentAiUse: currentAiUse.trim(),
			governanceRules: governanceShown ? governanceRules : '',
			governanceReview: governanceShown ? governanceReview : '',
			governanceComfort: governanceShown ? governanceComfort : ''
		};
	}

	async function fetchNext() {
		if (!staticComplete) return;
		if (adaptive.length >= ADAPTIVE_TARGET) return;
		if (pendingQuestion) return;
		if (loadingNext) return;

		loadingNext = true;
		const myVersion = staticVersion;

		const body: NextRequest = {
			static: buildStatic(),
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
			if (myVersion !== staticVersion) return;
			pendingQuestion = data;
		} catch (err) {
			if (myVersion !== staticVersion) return;
			console.warn('[adaptive-quiz] /api/quiz/next failed, using fallback:', err);
			pendingQuestion = getFallbackQuestion(adaptive.length);
		} finally {
			if (myVersion === staticVersion) loadingNext = false;
		}
	}

	$effect(() => {
		if (staticComplete && adaptive.length === 0 && !pendingQuestion && !loadingNext) {
			queueMicrotask(fetchNext);
		}
	});

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

		if (adaptive.length < ADAPTIVE_TARGET) fetchNext();
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;

		const submission: QuizSubmission = {
			static: buildStatic(),
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
			const body = (await res.json()) as { ok: boolean; id: string };
			submissionId = body.id;
			submitState = 'sent';
			try {
				posthog.capture('quiz_submitted', {
					industry: submission.static.industry,
					team_size: submission.static.size,
					regulated_data: submission.static.regulatedData,
					time_leak: submission.static.timeLeak,
					process_health: submission.static.processHealth
				});
			} catch {
				// swallow
			}
		} catch {
			submitState = 'mailto-fallback';
			window.location.href = generateQuizMailto(submission);
		}
	}

	function resend() {
		const submission: QuizSubmission = {
			static: buildStatic(),
			adaptive,
			email
		};
		window.location.href = generateQuizMailto(submission);
	}

	// Dynamic step numbers for badges, since the governance step is conditional.
	const stepNumbers = $derived.by(() => {
		const order: string[] = [
			'industry',
			'size',
			'regulated-data',
			...(governanceShown ? ['governance'] : []),
			'business-goal',
			'time-leak',
			'dreaded-task',
			'process-health',
			'current-ai-use'
		];
		const map: Record<string, number> = {};
		order.forEach((id, i) => (map[id] = i + 1));
		return map;
	});

	function label(n: number): string {
		return String(n).padStart(2, '0');
	}

	const chipClass =
		'block text-center p-3 bg-paper border border-rule rounded-lg text-sm font-sans text-muted peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-ink hover:border-ink/30 transition';
	const cardChipClass =
		'p-4 bg-paper border border-rule rounded-lg peer-checked:border-accent peer-checked:bg-accent/10 hover:border-ink/30 transition';
	const inputClass =
		'w-full p-3 bg-paper border border-rule rounded-lg text-ink font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent';
	const eyebrowClass =
		'text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2';
	const legendClass = 'block font-sans font-medium text-lg text-ink tracking-tight mb-3';
</script>

<SEO
	title="AI Readiness Quiz | DomeWorks"
	description="2-minute quiz to pinpoint your biggest time leak. Free personalised Action Plan delivered to your inbox."
/>

<!-- Hero -->
<section
	class="relative bg-ink text-paper overflow-hidden -mt-16 md:-mt-20"
	aria-label="AI Readiness Quiz"
>
	<div class="relative w-full max-w-6xl mx-auto px-6 lg:px-8 pt-40 md:pt-48 pb-16 md:pb-20">
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-8"
		>
			<span class="text-accent-light">AI Readiness Quiz</span>
			<span class="h-3 w-px bg-paper/25" aria-hidden="true"></span>
			<span class="text-paper/75 font-normal tracking-[0.08em]">Free · 4 to 6 minutes</span>
		</div>
		<h1
			class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
		>
			A few minutes. <span class="text-paper/70">Find your biggest</span>
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
			<!-- Industry -->
			<div>
				<p class={eyebrowClass}>{label(stepNumbers['industry'])}</p>
				<label for="industry" class={legendClass}>What does your business do?</label>
				<select id="industry" bind:value={industry} required class={inputClass}>
					<option value="">Select one</option>
					{#each QUIZ_INDUSTRIES as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<!-- Size -->
			<fieldset>
				<p class={eyebrowClass}>{label(stepNumbers['size'])}</p>
				<legend class={legendClass}>How many people are on your team?</legend>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['1-9', '1 to 9'], ['10-25', '10 to 25'], ['26-50', '26 to 50'], ['51-200', '51 to 200'], ['200+', '200+']] as [v, labelText] (v)}
						<label class="cursor-pointer">
							<input type="radio" bind:group={size} value={v} class="peer sr-only" required />
							<span class={chipClass}>{labelText}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Regulated data gate -->
			<fieldset>
				<p class={eyebrowClass}>{label(stepNumbers['regulated-data'])}</p>
				<legend class={legendClass}>
					Does your work involve protected health information, privileged legal information,
					customer financial information, or other records your industry treats as sensitive?
				</legend>
				<div class="space-y-2">
					{#each [['yes', 'Yes, definitely', 'Handling client or patient records is core to the work.'], ['sometimes', 'Sometimes or unsure', "Some files might qualify, I'd want to think it through."], ['no', 'No, not really', "The work doesn't touch that kind of data."]] as [v, title, body] (v)}
						<label class="cursor-pointer block">
							<input
								type="radio"
								bind:group={regulatedData}
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

			<!-- Governance grouped step (conditional) -->
			{#if governanceShown}
				<fieldset class="space-y-6">
					<p class={eyebrowClass}>{label(stepNumbers['governance'])} · Governance</p>
					<legend class="sr-only">Governance follow-ups</legend>

					<div>
						<p class={legendClass}>
							Do you already have rules about which AI tools staff can use, or is it informal?
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
							{#each [['formal', 'Formal rules'], ['informal', 'Informal'], ['none', 'None']] as [v, t] (v)}
								<label class="cursor-pointer">
									<input
										type="radio"
										bind:group={governanceRules}
										value={v}
										class="peer sr-only"
										required
									/>
									<span class={chipClass}>{t}</span>
								</label>
							{/each}
						</div>
					</div>

					<div>
						<p class={legendClass}>
							Before any client-facing document or record is changed, must a human review it?
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
							{#each [['always', 'Yes, always'], ['sometimes', 'Sometimes'], ['no', 'No']] as [v, t] (v)}
								<label class="cursor-pointer">
									<input
										type="radio"
										bind:group={governanceReview}
										value={v}
										class="peer sr-only"
										required
									/>
									<span class={chipClass}>{t}</span>
								</label>
							{/each}
						</div>
					</div>

					<div>
						<p class={legendClass}>
							Would you be comfortable with client data going through a third-party AI service
							today?
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
							{#each [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Unsure']] as [v, t] (v)}
								<label class="cursor-pointer">
									<input
										type="radio"
										bind:group={governanceComfort}
										value={v}
										class="peer sr-only"
										required
									/>
									<span class={chipClass}>{t}</span>
								</label>
							{/each}
						</div>
					</div>
				</fieldset>
			{/if}

			<!-- Business goal -->
			<div>
				<p class={eyebrowClass}>{label(stepNumbers['business-goal'])}</p>
				<label for="businessGoal" class={legendClass}>
					What's the top outcome for your business in the next 12 months?
				</label>
				<select id="businessGoal" bind:value={businessGoal} required class={inputClass}>
					<option value="">Select one</option>
					{#each BUSINESS_GOALS as g (g)}
						<option value={g}>{g}</option>
					{/each}
				</select>
				{#if businessGoal === 'Other'}
					<input
						type="text"
						bind:value={businessGoalOther}
						placeholder="Describe it briefly"
						class="{inputClass} mt-3"
						maxlength="200"
						required
					/>
				{/if}
			</div>

			<!-- Time leak -->
			<fieldset>
				<p class={eyebrowClass}>{label(stepNumbers['time-leak'])}</p>
				<legend class={legendClass}>Where does your time leak most?</legend>
				<div class="space-y-2">
					{#each [['admin', 'Admin', 'Invoicing, scheduling, email triage, document chasing.'], ['marketing', 'Marketing and lead response', 'Inbound lead follow-up, content cadence, quoting, proposals.'], ['delivery', 'Client delivery', 'Meeting prep and notes, recurring deliverables, reporting, handoffs.'], ['mixed', 'Not sure / mixed', "It's scattered. I want help seeing where to look first."]] as [v, title, body] (v)}
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

			<!-- Dreaded task + inline digitization probe -->
			<div>
				<p class={eyebrowClass}>{label(stepNumbers['dreaded-task'])}</p>
				<label for="dreadedTask" class={legendClass}>
					Which single task do you dread most? How often does it happen?
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

				{#if digitizationShown}
					<div class="mt-4 pl-4 border-l-2 border-accent/40">
						<label for="digitizationProbe" class={legendClass}>
							Where does this work start and end today?
						</label>
						<p class="font-serif text-sm text-muted leading-relaxed mb-3">
							E.g. an email inbox, a paper form scanned to PDF, a phone call, a shared spreadsheet.
						</p>
						<textarea
							id="digitizationProbe"
							bind:value={digitizationProbe}
							placeholder="Where it starts, where it ends up."
							rows="2"
							class={inputClass}
						></textarea>
					</div>
				{/if}
			</div>

			<!-- Process health -->
			<fieldset>
				<p class={eyebrowClass}>{label(stepNumbers['process-health'])}</p>
				<legend class={legendClass}>Which is closer to the truth about that task?</legend>
				<div class="space-y-2">
					{#each [['healthy', 'The process works', 'The task itself just eats time. The workflow around it is fine.'], ['broken', 'The process is broken', "That's where the real problem is. The task being painful is a symptom."], ['unsure', 'Honestly, not sure', 'Maybe a bit of both. Help me think about it.']] as [v, title, body] (v)}
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

			<!-- Current AI use -->
			<div>
				<p class={eyebrowClass}>{label(stepNumbers['current-ai-use'])}</p>
				<label for="currentAiUse" class={legendClass}>
					Has anyone on the team used AI tools for drafting, summarizing, scheduling, or intake?
					What happened?
				</label>
				<textarea
					id="currentAiUse"
					bind:value={currentAiUse}
					placeholder="e.g. tried ChatGPT for client emails, stopped because it sounded generic"
					rows="3"
					class={inputClass}
				></textarea>
				<p class="mt-2 text-xs text-subtle">Optional, but useful context.</p>
			</div>

			<!-- Answered adaptive questions -->
			{#each adaptive as a, i (a.id)}
				<fieldset disabled>
					<p class={eyebrowClass}>Based on your answers · {i + 1} of {ADAPTIVE_TARGET}</p>
					<legend class={legendClass}>{a.question}</legend>
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
			{#if adaptive.length < ADAPTIVE_TARGET && (loadingNext || pendingQuestion)}
				<fieldset>
					<p class={eyebrowClass}>
						Based on your answers · {adaptive.length + 1} of {ADAPTIVE_TARGET}
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
						<legend class={legendClass}>{pendingQuestion.question}</legend>
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

			<!-- Email (only after all adaptive answered) -->
			{#if adaptive.length === ADAPTIVE_TARGET}
				<div>
					<p class={eyebrowClass}>Final step</p>
					<label for="email" class={legendClass}>Where should I send your Action Plan?</label>
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
		<!-- Post-submit state. The result view fetches /api/quiz/report and renders the
		     shape-routed view (Quick Plan or Assessment-plus-Guardrails). On submission failure
		     we fall back to the mailto path the way Week 1 did. -->
		<div class="max-w-3xl mx-auto" use:reveal>
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
			{:else if submitState === 'sent' && submissionId}
				<QuizResultView {submissionId} {email} {industry} />
			{:else if submitState === 'sent'}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Received
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Thanks. Your Action Plan is on the way.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						I got your answers and I will email a personalised Action Plan to
						<strong class="font-sans font-medium text-ink">{email}</strong>
						within 24 hours.
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
						Automatic submission did not work so your mail client opened with your answers
						pre-filled. Hit send in that window and I will email your personalised Action Plan
						within 24 hours.
					</p>
					<button
						type="button"
						onclick={resend}
						class="mt-4 text-sm font-sans text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						Did not see an email window? Click here to try again.
					</button>
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

<!--
  Result view shown after a quiz submission. Fetches /api/quiz/report and renders the
  shape-routed view (Quick Plan or Assessment). Falls back to a "we will email you"
  message if the scorer does not respond within 10 seconds.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { ScorerOutput } from '$lib/server/scorer';
	import type { Citation } from '$lib/data/regulated-data-citations';

	interface Props {
		submissionId: string;
		email: string;
		industry?: string;
	}

	let { submissionId, email, industry = '' }: Props = $props();

	// Stage 2 intake endpoints. Phone CTA hides when the number is not yet
	// configured; chat CTA always shows and passes industry through.
	// Replace DOMEWORKS_PHONE_E164 once the 702 Twilio number lands.
	const DOMEWORKS_PHONE_E164 = ''; // e.g. '+17025551234'
	const DOMEWORKS_PHONE_DISPLAY = ''; // e.g. '(702) 555-1234'
	const VOICE_AGENT_CHAT_URL = 'https://voice-intake-dev.domeworks.workers.dev/chat.html';

	const showPhone = DOMEWORKS_PHONE_E164.length > 0;
	const chatUrl = $derived(
		industry
			? `${VOICE_AGENT_CHAT_URL}?industry=${encodeURIComponent(industry)}`
			: VOICE_AGENT_CHAT_URL
	);

	let loadState = $state<'loading' | 'ready' | 'fallback'>('loading');
	let result = $state<ScorerOutput | null>(null);

	const SCORER_TIMEOUT_MS = 10_000;

	function quickWinCount(o: ScorerOutput): number {
		return o.opportunities.filter((c) => c.quadrant === 'quick-win').length;
	}

	function topThree(o: ScorerOutput) {
		return o.opportunities.filter((c) => c.quadrant === 'quick-win').slice(0, 3);
	}

	function quadrantOpps(o: ScorerOutput, q: string) {
		return o.opportunities.filter((c) => c.quadrant === q);
	}

	const verdictLabel: Record<string, string> = {
		pilot: 'Ready for pilot',
		cleanup: 'Cleanup first',
		'policy-first': 'Policy first',
		'strategy-first': 'Strategy first'
	};

	const tierLabel: Record<string, string> = {
		strict: 'Strict guardrails apply',
		standard: 'Standard guardrails apply',
		none: 'No sector-specific guardrails',
		unknown: 'Authority sources unavailable'
	};

	const levelClass: Record<string, string> = {
		High: 'bg-accent/10 text-ink border-accent/40',
		Medium: 'bg-paper text-ink border-rule',
		Low: 'bg-rule/40 text-muted border-rule'
	};

	function heatMapRows(out: ScorerOutput) {
		const sc = out.readiness_scorecard;
		return [
			{ label: 'Strategic Fit', dim: sc.strategic_fit },
			{ label: 'Workflow', dim: sc.workflow },
			{ label: 'Data', dim: sc.data },
			{ label: 'AI Fluency', dim: sc.ai_fluency },
			{ label: 'Governance', dim: sc.governance },
			{ label: 'Change Capacity', dim: sc.change_capacity }
		];
	}

	onMount(() => {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), SCORER_TIMEOUT_MS);

		fetch('/api/quiz/report', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ submission_id: submissionId }),
			signal: controller.signal
		})
			.then(async (res) => {
				clearTimeout(timer);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = (await res.json()) as ScorerOutput;
				result = data;
				loadState = 'ready';
			})
			.catch((err) => {
				clearTimeout(timer);
				console.warn('[quiz-result] scorer fetch failed, using fallback:', err);
				loadState = 'fallback';
			});

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	});

	function formatMinutes(m: number): string {
		if (m < 60) return `${m} min`;
		return `${Math.round((m / 60) * 10) / 10} hours`;
	}
</script>

{#if loadState === 'loading'}
	<div class="rule-left-accent">
		<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
			Calculating your readiness scorecard
		</p>
		<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
			Drafting your Action Plan now.
		</h2>
		<p class="font-serif text-muted leading-relaxed">
			Reading your answers, picking tools that fit your industry, sizing the time savings. Roughly
			six seconds.
		</p>
	</div>
	<div class="space-y-3 mt-8" aria-busy="true">
		<div class="h-8 w-3/4 bg-rule/60 rounded animate-pulse"></div>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
			<div class="h-24 bg-rule/40 rounded-lg animate-pulse"></div>
			<div class="h-24 bg-rule/40 rounded-lg animate-pulse"></div>
			<div class="h-24 bg-rule/40 rounded-lg animate-pulse"></div>
		</div>
	</div>
{:else if loadState === 'fallback' || !result}
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
{:else if result.report_shape === 'quick-plan'}
	<!-- QUICK PLAN -->
	<div class="space-y-12">
		<!-- Hero ROI stat -->
		<div class="rule-left-accent">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
				Your Action Plan
			</p>
			<h2 class="font-sans font-medium text-3xl text-ink tracking-tight mb-2">
				{result.financial_impact.weekly_hours_returned} hours per week, returned.
			</h2>
			<p class="font-serif text-muted leading-relaxed">
				Across {quickWinCount(result)} Quick Wins. Net of tool cost: about
				<strong class="font-sans font-medium text-ink"
					>${result.financial_impact.monthly_net_roi.toLocaleString()} per month</strong
				>.
			</p>
		</div>

		<!-- Impact / Effort 2x2 -->
		<div>
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Impact / Effort
			</p>
			<div class="grid grid-cols-2 border border-rule rounded-lg overflow-hidden">
				<div class="border-r border-b border-rule bg-accent/5 p-4">
					<p class="text-xs font-semibold text-accent mb-2">Quick Wins (high impact, low effort)</p>
					<ul class="font-sans text-sm text-ink space-y-1">
						{#each quadrantOpps(result, 'quick-win') as o (o.tool)}
							<li>{o.tool}: {o.title}</li>
						{:else}
							<li class="text-muted italic">None this round.</li>
						{/each}
					</ul>
				</div>
				<div class="border-b border-rule p-4">
					<p class="text-xs font-semibold text-muted mb-2">
						Major Projects (high impact, high effort)
					</p>
					<ul class="font-sans text-sm text-muted space-y-1">
						{#each quadrantOpps(result, 'strategic') as o (o.tool)}
							<li>{o.tool}: {o.title}</li>
						{:else}
							<li class="italic">None.</li>
						{/each}
					</ul>
				</div>
				<div class="border-r border-rule p-4">
					<p class="text-xs font-semibold text-muted mb-2">Fill-ins (low impact, low effort)</p>
					<ul class="font-sans text-sm text-muted space-y-1">
						{#each quadrantOpps(result, 'foundational') as o (o.tool)}
							<li>{o.tool}: {o.title}</li>
						{:else}
							<li class="italic">None.</li>
						{/each}
					</ul>
				</div>
				<div class="bg-rule/20 p-4">
					<p class="text-xs font-semibold text-muted mb-2">Ignore These</p>
					<p class="font-sans text-sm text-muted italic">No tools land here.</p>
				</div>
			</div>
		</div>

		<!-- Tool cards -->
		<div>
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Recommended solutions
			</p>
			<div class="space-y-4">
				{#each quadrantOpps(result, 'quick-win') as o (o.tool)}
					<div class="border border-rule rounded-lg p-5 bg-paper">
						<div class="flex flex-wrap items-start justify-between gap-3 mb-2">
							<h3 class="font-sans font-medium text-lg text-ink">{o.title}</h3>
							<span class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase"
								>{o.tool}</span
							>
						</div>
						<p class="font-serif text-sm text-muted leading-relaxed mb-4">{o.why_this_fits}</p>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Complexity</p>
								<p class="font-sans text-ink">{o.complexity}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Monthly cost</p>
								<p class="font-sans text-ink">${o.monthly_cost}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Setup time</p>
								<p class="font-sans text-ink">{formatMinutes(o.setup_time_minutes)}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Time saved</p>
								<p class="font-sans text-ink">{o.hours_saved_per_week} hrs/week</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- 4-day plan -->
		<div>
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Your 4-day Quick Wins plan
			</p>
			<ol class="space-y-3">
				{#each result.four_day_plan as p (p.day)}
					<li class="flex items-start gap-4">
						<span
							class="flex-shrink-0 w-9 h-9 rounded-full border border-accent/40 bg-accent/10 text-accent flex items-center justify-center font-sans font-semibold text-sm"
							>{p.day}</span
						>
						<p class="font-serif text-muted leading-relaxed pt-1">{p.task}</p>
					</li>
				{:else}
					<li class="font-serif text-muted italic">No Quick Wins to schedule this round.</li>
				{/each}
			</ol>
		</div>

		<!-- Financial Impact -->
		<div class="border-t border-rule pt-8">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Financial impact
			</p>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
				<div>
					<p class="text-xs text-subtle uppercase tracking-wide">Weekly time returned</p>
					<p class="font-sans font-medium text-2xl text-ink">
						{result.financial_impact.weekly_hours_returned} hrs
					</p>
				</div>
				<div>
					<p class="text-xs text-subtle uppercase tracking-wide">Monthly net ROI</p>
					<p class="font-sans font-medium text-2xl text-ink">
						${result.financial_impact.monthly_net_roi.toLocaleString()}
					</p>
				</div>
				<div>
					<p class="text-xs text-subtle uppercase tracking-wide">Total monthly tool cost</p>
					<p class="font-sans font-medium text-2xl text-ink">
						${result.financial_impact.total_monthly_tool_cost}
					</p>
				</div>
			</div>
			<p class="text-xs text-subtle mt-4">
				Assumes a ${result.financial_impact.hourly_rate_used} per hour fully-loaded labor cost. The full
				report (en route to your inbox) shows the math.
			</p>
		</div>

		<!-- Next steps -->
		<div class="border-t border-rule pt-8">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
				Your next steps
			</p>
			<ol class="space-y-2 mb-6 font-serif text-muted leading-relaxed">
				<li>1. Implement the Quick Wins above. Each one is a single decision, not a project.</li>
				<li>2. Book a 30-minute Review Call, call me, or chat with my intake assistant.</li>
			</ol>
			<div class="flex flex-wrap gap-3">
				<a
					href="https://cal.com/prollinson/ai-audit"
					target="_blank"
					rel="noopener"
					class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 bg-accent text-paper rounded-lg hover:bg-accent-hover transition"
					>Book the 30-minute Review Call</a
				>
				{#if showPhone}
					<a
						href="tel:{DOMEWORKS_PHONE_E164}"
						class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition"
						>Call {DOMEWORKS_PHONE_DISPLAY}</a
					>
				{/if}
				<a
					href={chatUrl}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 border border-rule text-ink rounded-lg hover:bg-rule/20 transition"
					>Prefer to type? Open the chat intake</a
				>
			</div>
		</div>
	</div>
{:else}
	<!-- ASSESSMENT PLUS GUARDRAILS -->
	<div class="space-y-12">
		<!-- Verdict + landing message -->
		<div class="rule-left-accent">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
				Readiness verdict
			</p>
			<h2 class="font-sans font-medium text-3xl text-ink tracking-tight mb-2">
				{verdictLabel[result.recommended_next_step] ?? result.recommended_next_step}.
			</h2>
			<p class="font-serif text-muted leading-relaxed">
				{result.recommended_next_step_rationale}
			</p>
			<p class="font-serif text-sm text-subtle leading-relaxed mt-4">
				The full report is landing in your inbox at
				<strong class="font-sans font-medium text-ink">{email}</strong>. The preview below covers
				the readiness map and the top three Quick Wins so you can act on the easy ones now.
			</p>
		</div>

		<!-- Heat map -->
		<div>
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Readiness heat map
			</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{#each heatMapRows(result) as row (row.label)}
					<div class="border rounded-lg p-4 {levelClass[row.dim.level]}">
						<div class="flex items-center justify-between mb-2">
							<p class="font-sans font-medium text-sm">{row.label}</p>
							<span class="text-xs font-semibold tracking-wide">{row.dim.level}</span>
						</div>
						<p class="font-serif text-xs leading-relaxed">{row.dim.rationale}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Guardrail tier badge -->
		{#if result.guardrail.tier !== 'none'}
			<div class="border border-accent/30 bg-accent/5 rounded-lg p-4">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Sector guardrails
				</p>
				<p class="font-sans font-medium text-ink mb-1">{tierLabel[result.guardrail.tier]}.</p>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Human review policy: <strong>{result.guardrail.human_review_policy}</strong>. Citations:
					{#if result.guardrail.sector_citations.length}
						<span class="font-sans"
							>{result.guardrail.sector_citations.map((c: Citation) => c.source).join(', ')}</span
						>.
					{:else}
						<em>none</em>.
					{/if}
				</p>
			</div>
		{/if}

		<!-- Top 3 tool card preview -->
		<div>
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3">
				Top three Quick Wins (preview)
			</p>
			<div class="space-y-4">
				{#each topThree(result) as o (o.tool)}
					<div class="border border-rule rounded-lg p-5 bg-paper">
						<div class="flex flex-wrap items-start justify-between gap-3 mb-2">
							<h3 class="font-sans font-medium text-lg text-ink">{o.title}</h3>
							<span class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase"
								>{o.tool}</span
							>
						</div>
						<p class="font-serif text-sm text-muted leading-relaxed mb-4">{o.why_this_fits}</p>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Complexity</p>
								<p class="font-sans text-ink">{o.complexity}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Monthly cost</p>
								<p class="font-sans text-ink">${o.monthly_cost}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Setup time</p>
								<p class="font-sans text-ink">{formatMinutes(o.setup_time_minutes)}</p>
							</div>
							<div>
								<p class="text-xs text-subtle uppercase tracking-wide">Time saved</p>
								<p class="font-sans text-ink">{o.hours_saved_per_week} hrs/week</p>
							</div>
						</div>
					</div>
				{:else}
					<p class="font-serif text-muted italic">
						No Quick Wins surfaced from the answers; the full report covers Foundational moves
						first.
					</p>
				{/each}
			</div>
		</div>

		<!-- Next steps -->
		<div class="border-t border-rule pt-8">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
				Your next steps
			</p>
			<p class="font-serif text-muted leading-relaxed mb-6">
				The full assessment with current-state findings, foundational and strategic items,
				governance citations, and decision gates is landing in your inbox. Book a 30-minute Review
				Call, call me, or chat with my intake assistant to walk through it.
			</p>
			<div class="flex flex-wrap gap-3">
				<a
					href="https://cal.com/prollinson/ai-audit"
					target="_blank"
					rel="noopener"
					class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 bg-accent text-paper rounded-lg hover:bg-accent-hover transition"
					>Book the 30-minute Review Call</a
				>
				{#if showPhone}
					<a
						href="tel:{DOMEWORKS_PHONE_E164}"
						class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition"
						>Call {DOMEWORKS_PHONE_DISPLAY}</a
					>
				{/if}
				<a
					href={chatUrl}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center justify-center font-sans font-medium px-6 py-3 border border-rule text-ink rounded-lg hover:bg-rule/20 transition"
					>Prefer to type? Open the chat intake</a
				>
			</div>
		</div>
	</div>
{/if}

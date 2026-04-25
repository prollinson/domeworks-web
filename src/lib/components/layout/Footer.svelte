<script lang="ts">
	import { getBookCallUrl } from '$lib/utils/mailto';

	const leadersLinks = [
		{ href: '/leaders/', label: 'Overview' },
		{ href: '/leaders/scan/', label: 'AI Scan' },
		{ href: '/leaders/assessment/', label: 'Assessment' },
		{ href: '/leaders/context-build/', label: 'Context Build' },
		{ href: '/leaders/orchestration-build/', label: 'Orchestration Build' },
		{ href: '/leaders/fractional/', label: 'Fractional' }
	];

	const smbLinks = [
		{ href: '/smb/', label: 'Overview' },
		{ href: '/smb/quiz/', label: '2-Minute Quiz' }
	];

	const siteLinks = [
		{ href: '/about/', label: 'About' },
		{ href: '/contact/', label: 'Contact' }
	];
</script>

<footer class="bg-ink text-paper relative">
	<div class="relative border-b border-paper/10">
		<div class="max-w-6xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
			<div class="max-w-4xl">
				<h2 class="footer-headline font-sans font-semibold text-paper mb-8">
					Let's figure out<br class="hidden sm:block" /> what's missing<span
						class="text-accent-light">.</span
					>
				</h2>
				<p class="text-lg md:text-xl text-paper/70 max-w-xl mb-10">
					30 minutes on a call and I can tell you whether your team's AI adoption is a tooling
					problem or a systems problem.
				</p>
				<a
					href={getBookCallUrl()}
					class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all active:scale-[0.98] shadow-sm hover:shadow"
				>
					Book a discovery call
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>

	<div class="relative">
		<div class="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
				<div class="col-span-2 md:col-span-1">
					<a href="/" class="text-xl font-medium tracking-tight"
						>DomeWorks<span class="text-accent-light">.</span></a
					>
					<p class="mt-4 text-sm text-paper/60">
						AI infrastructure that replaces coordination overhead
					</p>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">
						For leaders
					</p>
					<ul class="space-y-3">
						{#each leadersLinks as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-paper/70 hover:text-paper transition-colors"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">
						For SMBs
					</p>
					<ul class="space-y-3">
						{#each smbLinks as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-paper/70 hover:text-paper transition-colors"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">Site</p>
					<ul class="space-y-3 mb-6">
						{#each siteLinks as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-paper/70 hover:text-paper transition-colors"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
					<p class="text-sm text-paper/70">piers@domeworks.tech</p>
					<p class="mt-2 text-sm text-paper/70">Remote / US-based</p>
				</div>
			</div>

			<div
				class="mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-4"
			>
				<p class="text-xs text-paper/50">
					&copy; {new Date().getFullYear()} DomeWorks. All rights reserved.
				</p>
				<p class="text-xs text-paper/50">Replacing coordination overhead with AI infrastructure</p>
			</div>
		</div>
	</div>
</footer>

<script lang="ts">
	import { page } from '$app/stores';
	import { getBookCallUrl } from '$lib/utils/mailto';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let menuOpen = $state(false);
	let scrolled = $state(false);
	let isHeroPage = $derived($page.url.pathname === '/');

	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	const serviceLinks = [
		{ href: '/leaders/scan/', label: 'AI Scan' },
		{ href: '/leaders/context-build/', label: 'Context Build' },
		{ href: '/leaders/orchestration-build/', label: 'Orchestration Build' },
		{ href: '/leaders/fractional/', label: 'Fractional' }
	];

	const otherLinks = [
		{ href: '/about/', label: 'About' },
		{ href: '/contact/', label: 'Contact' }
	];

	const navLinks = [...serviceLinks, ...otherLinks];

	let servicesOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
		if (!menuOpen) servicesOpen = false;
	}

	/* On hero page, header text is light until scrolled past the dark section */
	let heroMode = $derived(isHeroPage && !scrolled);

	let reducedMotion = $state(false);

	if (typeof window !== 'undefined') {
		$effect(() => {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
			reducedMotion = mq.matches;
			const handler = (e: MediaQueryListEvent) => {
				reducedMotion = e.matches;
			};
			mq.addEventListener('change', handler);
			return () => mq.removeEventListener('change', handler);
		});

		$effect(() => {
			const handleScroll = () => {
				scrolled = window.scrollY > 20;
			};
			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
		});
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
    {scrolled
		? 'bg-paper/80 backdrop-blur-md shadow-sm border-b border-rule'
		: 'bg-transparent'}"
>
	<nav class="max-w-6xl mx-auto px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 md:h-20">
			<a
				href="/"
				class="text-xl font-semibold tracking-tight transition-colors
          {heroMode
					? 'text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:text-paper/90'
					: 'text-ink hover:text-accent'}"
			>
				DomeWorks
			</a>

			<div class="hidden lg:flex items-center gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-4 py-2 text-sm font-medium rounded-lg transition-all
              {isActive(link.href)
							? heroMode
								? 'text-paper bg-paper/10'
								: 'text-accent bg-accent/6'
							: heroMode
								? 'text-paper/70 hover:text-paper hover:bg-paper/5'
								: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
						aria-current={isActive(link.href) ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}

				<a
					href={getBookCallUrl()}
					class="ml-4 px-5 py-2.5 text-sm font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all shadow-sm hover:shadow"
				>
					Book a call
				</a>
			</div>

			<button
				onclick={toggleMenu}
				class="lg:hidden p-2 -mr-2 rounded-lg transition-all
          {heroMode
					? 'text-paper/70 hover:text-paper hover:bg-paper/5'
					: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
			>
				{#if menuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if menuOpen}
			<div
				transition:slide={{ duration: reducedMotion ? 0 : 250, easing: cubicOut }}
				class="lg:hidden pb-6 border-t border-rule mt-2 pt-4"
			>
				<div class="flex flex-col gap-1">
					<button
						onclick={() => (servicesOpen = !servicesOpen)}
						class="flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all
              {serviceLinks.some((l) => isActive(l.href))
							? 'text-accent bg-accent/6'
							: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
					>
						Services
						<svg
							class="w-4 h-4 transition-transform duration-200 {servicesOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if servicesOpen}
						<div
							transition:slide={{ duration: reducedMotion ? 0 : 200, easing: cubicOut }}
							class="ml-4 flex flex-col gap-1"
						>
							{#each serviceLinks as link}
								<a
									href={link.href}
									class="px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                    {isActive(link.href)
										? 'text-accent bg-accent/6'
										: 'text-ink/60 hover:text-ink hover:bg-paper-alt'}"
									aria-current={isActive(link.href) ? 'page' : undefined}
									onclick={() => {
										menuOpen = false;
										servicesOpen = false;
									}}
								>
									{link.label}
								</a>
							{/each}
						</div>
					{/if}

					{#each otherLinks as link}
						<a
							href={link.href}
							class="px-4 py-3 text-base font-medium rounded-lg transition-all
                {isActive(link.href)
							? 'text-accent bg-accent/6'
							: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
							aria-current={isActive(link.href) ? 'page' : undefined}
							onclick={() => (menuOpen = false)}
						>
							{link.label}
						</a>
					{/each}

					<a
						href={getBookCallUrl()}
						class="mt-4 px-5 py-3 text-center text-base font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all"
					>
						Book a call
					</a>
				</div>
			</div>
		{/if}
	</nav>
</header>

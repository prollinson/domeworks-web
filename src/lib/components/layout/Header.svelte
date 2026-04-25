<script lang="ts">
	import { page } from '$app/stores';
	import { getBookCallUrl } from '$lib/utils/mailto';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type NavChild = { href: string; label: string };
	type NavItem = { href: string; label: string; children?: NavChild[] };

	let menuOpen = $state(false);
	let scrolled = $state(false);

	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	const leadersChildren: NavChild[] = [
		{ href: '/leaders/', label: 'Overview' },
		{ href: '/leaders/scan/', label: 'AI Scan' },
		{ href: '/leaders/assessment/', label: 'Assessment' },
		{ href: '/leaders/context-build/', label: 'Context Build' },
		{ href: '/leaders/orchestration-build/', label: 'Orchestration Build' },
		{ href: '/leaders/fractional/', label: 'Fractional' }
	];

	const smbChildren: NavChild[] = [
		{ href: '/smb/', label: 'Overview' },
		{ href: '/smb/quiz/', label: '2-Minute Quiz' }
	];

	const fullNav: NavItem[] = [
		{ href: '/leaders/', label: 'For leaders', children: leadersChildren },
		{ href: '/smb/', label: 'For SMBs', children: smbChildren },
		{ href: '/about/', label: 'About' },
		{ href: '/contact/', label: 'Contact' }
	];

	/* Section-aware nav: when the visitor is inside /leaders/* or /smb/*, show only
	   the in-section pages so the header reads as a local index. The DomeWorks logo
	   is the escape hatch back to /, where the full cross-site nav lives. */
	let navItems = $derived.by<NavItem[]>(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/leaders/')) return leadersChildren;
		if (path.startsWith('/smb/')) return smbChildren;
		return fullNav;
	});

	let openDropdown = $state<string | null>(null);

	function toggleMenu() {
		menuOpen = !menuOpen;
		if (!menuOpen) openDropdown = null;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!openDropdown) return;
		const target = event.target as HTMLElement;
		// Ignore clicks inside any dropdown surface (desktop) or any nav dropdown trigger (mobile).
		if (target.closest('[data-nav-dropdown]') || target.closest('header nav')) return;
		openDropdown = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && openDropdown) openDropdown = null;
	}

	/* Every page in the site starts with a dark hero, so before the visitor scrolls
	   the header floats transparent over that dark surface and uses light text.
	   Once they scroll past it (or open the mobile menu) we swap to a paper bg
	   with dark text. If a future page lands on a light surface, this assumption
	   needs revisiting (see DESIGN.md). */
	let heroMode = $derived(!scrolled && !menuOpen);

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

		$effect(() => {
			document.addEventListener('click', handleDocumentClick);
			document.addEventListener('keydown', handleKeydown);
			return () => {
				document.removeEventListener('click', handleDocumentClick);
				document.removeEventListener('keydown', handleKeydown);
			};
		});
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
    {scrolled || menuOpen
		? 'bg-paper/95 backdrop-blur-md shadow-sm border-b border-rule'
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
				{#each navItems as item}
					{#if item.children}
						<div class="relative" data-nav-dropdown>
							<button
								type="button"
								onclick={() =>
									(openDropdown = openDropdown === item.href ? null : item.href)}
								aria-haspopup="true"
								aria-expanded={openDropdown === item.href}
								class="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
                {isActive(item.href)
									? heroMode
										? 'text-paper bg-paper/10'
										: 'text-accent bg-accent/6'
									: heroMode
										? 'text-paper/70 hover:text-paper hover:bg-paper/5'
										: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
							>
								{item.label}
								<svg
									class="w-3.5 h-3.5 transition-transform duration-200 {openDropdown ===
									item.href
										? 'rotate-180'
										: ''}"
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
							{#if openDropdown === item.href}
								<div
									transition:slide={{ duration: reducedMotion ? 0 : 160, easing: cubicOut }}
									class="absolute left-0 top-full mt-2 min-w-[14rem] bg-paper border border-rule rounded-lg shadow-lg overflow-hidden"
								>
									<div class="py-1.5">
										{#each item.children as child}
											<a
												href={child.href}
												onclick={() => (openDropdown = null)}
												aria-current={isActive(child.href) && $page.url.pathname ===
													child.href
													? 'page'
													: undefined}
												class="block px-4 py-2 text-sm font-medium transition-colors
                          {$page.url.pathname === child.href
													? 'text-accent bg-accent/6'
													: 'text-ink/80 hover:text-ink hover:bg-paper-alt'}"
											>
												{child.label}
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<a
							href={item.href}
							class="px-4 py-2 text-sm font-medium rounded-lg transition-all
              {$page.url.pathname === item.href
								? heroMode
									? 'text-paper bg-paper/10'
									: 'text-accent bg-accent/6'
								: heroMode
									? 'text-paper/70 hover:text-paper hover:bg-paper/5'
									: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
							aria-current={$page.url.pathname === item.href ? 'page' : undefined}
						>
							{item.label}
						</a>
					{/if}
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
					{#each navItems as item}
						{#if item.children}
							<button
								type="button"
								onclick={() => (openDropdown = openDropdown === item.href ? null : item.href)}
								aria-expanded={openDropdown === item.href}
								class="flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all
                  {isActive(item.href)
									? 'text-accent bg-accent/6'
									: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
							>
								{item.label}
								<svg
									class="w-4 h-4 transition-transform duration-200 {openDropdown === item.href
										? 'rotate-180'
										: ''}"
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
							{#if openDropdown === item.href}
								<div
									transition:slide={{ duration: reducedMotion ? 0 : 200, easing: cubicOut }}
									class="ml-4 flex flex-col gap-1"
								>
									{#each item.children as child}
										<a
											href={child.href}
											aria-current={$page.url.pathname === child.href ? 'page' : undefined}
											onclick={() => {
												menuOpen = false;
												openDropdown = null;
											}}
											class="px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                        {$page.url.pathname === child.href
												? 'text-accent bg-accent/6'
												: 'text-ink/60 hover:text-ink hover:bg-paper-alt'}"
										>
											{child.label}
										</a>
									{/each}
								</div>
							{/if}
						{:else}
							<a
								href={item.href}
								class="px-4 py-3 text-base font-medium rounded-lg transition-all
                  {$page.url.pathname === item.href
									? 'text-accent bg-accent/6'
									: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
								aria-current={$page.url.pathname === item.href ? 'page' : undefined}
								onclick={() => (menuOpen = false)}
							>
								{item.label}
							</a>
						{/if}
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

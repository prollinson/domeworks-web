<script lang="ts">
  import { page } from '$app/stores'
  import { generateSmbMailto } from '$lib/utils/mailto'

  let menuOpen = $state(false)
  let scrolled = $state(false)

  // Check if a nav link is active
  function isActive(href: string): boolean {
    const currentPath = $page.url.pathname
    // Exact match for home, startsWith for other pages
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  const navLinks = [
    { href: '/services/', label: 'Services' },
    { href: '/enterprise/', label: 'Enterprise' },
    { href: '/process/', label: 'Process' },
    { href: '/examples/', label: 'Examples' },
    { href: '/security/', label: 'Security' },
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' }
  ]

  function toggleMenu() {
    menuOpen = !menuOpen
  }

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    $effect(() => {
      const handleScroll = () => {
        scrolled = window.scrollY > 20
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    })
  }
</script>

<header
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
    {scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}"
>
  <nav class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Logo -->
      <a
        href="/"
        class="text-xl font-semibold tracking-tight text-slate-900 hover:text-primary transition-colors"
      >
        Dome Works
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center gap-1">
        {#each navLinks as link}
          <a
            href={link.href}
            class="px-4 py-2 text-sm font-medium rounded-lg transition-all
              {isActive(link.href)
                ? 'text-primary bg-primary/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}"
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </a>
        {/each}

        <a
          href={generateSmbMailto()}
          class="ml-4 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-sm hover:shadow"
        >
          Email us
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        onclick={toggleMenu}
        class="lg:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {#if menuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>

    <!-- Mobile Navigation -->
    {#if menuOpen}
      <div class="lg:hidden pb-6 border-t border-slate-100 mt-2 pt-4">
        <div class="flex flex-col gap-1">
          {#each navLinks as link}
            <a
              href={link.href}
              class="px-4 py-3 text-base font-medium rounded-lg transition-all
                {isActive(link.href)
                  ? 'text-primary bg-primary/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
              aria-current={isActive(link.href) ? 'page' : undefined}
              onclick={() => menuOpen = false}
            >
              {link.label}
            </a>
          {/each}

          <a
            href={generateSmbMailto()}
            class="mt-4 px-5 py-3 text-center text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all"
          >
            Email us
          </a>
        </div>
      </div>
    {/if}
  </nav>
</header>

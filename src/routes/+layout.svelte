<script>
  import { onNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import Header from '$lib/components/layout/Header.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
  import '../tailwind.css'
  import { posthog } from '$lib/posthog'

  let { children } = $props()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'DomeWorks',
    description: 'Intelligence infrastructure engineering for engineering organizations. We build the Context and Orchestration layers that replace coordination overhead with AI-native systems.',
    url: 'https://domeworks.ai',
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    serviceType: ['Intelligence Infrastructure Engineering', 'AI Consulting', 'Context Layer Engineering', 'Orchestration Layer Engineering'],
    priceRange: '$2,500–$15,000+',
    email: 'piers@domeworks.ai'
  }

  // Enable View Transitions API for smooth page navigation
  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })

  // Track page views with PostHog
  $effect(() => {
    if (typeof window !== 'undefined' && $page.url.pathname) {
      posthog.capture('$pageview', {
        $current_url: $page.url.href,
        path: $page.url.pathname
      })
    }
  })
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<Header />

<main class="pt-16 md:pt-20">
  {@render children()}
</main>

<Footer />
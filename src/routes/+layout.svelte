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
    name: 'Dome Works',
    description: 'Automation consultancy serving Las Vegas Valley businesses. We build workflow automation, integrations, and AI-assisted operations.',
    url: 'https://domeworks.tech',
    areaServed: {
      '@type': 'Place',
      name: 'Las Vegas Valley, Nevada'
    },
    serviceType: ['Workflow Automation', 'AI Consulting', 'Business Process Automation'],
    priceRange: '$3,500–$24,000',
    email: 'hello@domeworks.tech'
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
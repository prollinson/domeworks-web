<script>
  import { onNavigate } from '$app/navigation'
  import Header from '$lib/components/layout/Header.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
  import '../tailwind.css'

  let { children } = $props()

  // Enable View Transitions API for smooth page navigation
  onNavigate((navigation) => {
    // @ts-expect-error - View Transitions API not yet in TypeScript
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      // @ts-expect-error - View Transitions API not yet in TypeScript
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<Header />

<main class="pt-16 md:pt-20">
  {@render children()}
</main>

<Footer />
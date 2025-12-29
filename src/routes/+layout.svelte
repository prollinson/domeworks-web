<script>
  import Header from '$lib/components/layout/Header.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
  import '../tailwind.css'

  let { children } = $props()
</script>

<Header />

<main class="pt-16 md:pt-20">
  {@render children()}
</main>

<Footer />
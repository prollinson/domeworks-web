<script>
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import '../tailwind.css'
</script>

<Header />

<div class="container w-full md:max-w-3xl mx-auto pt-20">
  <slot />
</div>

<Footer />
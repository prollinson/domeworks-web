<script>
  import SEO from '$lib/components/SEO.svelte'
  import Button from '$lib/components/ui/Button.svelte'

  let { data } = $props()
</script>

<SEO
  title="Blog — Dome Works"
  description="Guides and insights on automation, AI agents, and streamlining business operations."
/>

<section class="bg-white py-20 md:py-28">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">
    <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
      Blog
    </h1>
    <p class="mt-4 text-xl text-slate-600">
      Guides and insights on automation, AI, and business operations.
    </p>

    <div class="mt-12 space-y-10">
      {#each data.posts as post}
        <article class="group">
          <a href={post.path} class="block">
            {#if post.meta.date}
              <time class="text-sm text-slate-400 font-medium tracking-wide uppercase">
                {new Date(post.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            {/if}
            <h2 class="mt-2 font-serif text-2xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
              {post.meta.title}
            </h2>
            {#if post.meta.description}
              <p class="mt-2 text-slate-600 leading-relaxed">
                {post.meta.description}
              </p>
            {/if}
          </a>
        </article>
      {/each}
    </div>
  </div>
</section>

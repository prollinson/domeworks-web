<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title} — Dome Works</title>
	<meta name="description" content={data.meta.description} />
	{#if data.meta.keywords}
		<meta name="keywords" content={data.meta.keywords} />
	{/if}
	<meta property="og:title" content="{data.meta.title} — Dome Works" />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.meta.title} — Dome Works" />
	<meta name="twitter:description" content={data.meta.description} />
</svelte:head>

<article class="py-20 md:py-28">
	<div class="max-w-3xl mx-auto px-6 lg:px-8">
		<a
			href="/blog/"
			class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8"
		>
			&larr; Back to blog
		</a>

		<header class="mb-12">
			<p class="text-sm text-slate-500 mb-4">
				{new Date(data.meta.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</p>
			<h1
				class="font-serif text-3xl md:text-4xl font-semibold text-slate-900 leading-tight text-wrap-balance"
			>
				{data.meta.title}
			</h1>
		</header>

		<div
			class="prose prose-slate prose-lg max-w-none
      prose-headings:font-serif prose-headings:font-semibold
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:leading-relaxed prose-p:text-slate-700
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-slate-900
      prose-li:text-slate-700
      prose-table:text-sm
      prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
      prose-td:text-slate-700
    "
		>
			<data.content />
		</div>

		<div class="mt-16 pt-12 border-t border-slate-200">
			<div class="bg-slate-50 rounded-xl p-8 text-center">
				<h2 class="font-serif text-2xl font-semibold text-slate-900 mb-3">Ready to automate?</h2>
				<p class="text-slate-600 mb-6 max-w-lg mx-auto">
					We help SMBs eliminate manual workflows with a structured audit-to-automation approach.
					Start with a free workflow audit.
				</p>
				<Button href="/contact/">Schedule a conversation</Button>
			</div>
		</div>
	</div>
</article>

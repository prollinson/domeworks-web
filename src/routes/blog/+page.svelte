<script>
	import Section from '$lib/components/layout/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Dome Works</title>
	<meta
		name="description"
		content="Practical insights on workflow automation, business process optimization, and technology integration for small and mid-size businesses."
	/>
</svelte:head>

<Section
	padding="lg"
	eyebrow="Insights"
	title="Automation That Pays for Itself"
	description="Practical guides for SMBs looking to eliminate manual workflows and scale operations."
>
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each data.posts as post}
			<a
				href={post.path + '/'}
				class="group block bg-white border border-slate-200 rounded-xl p-6 card-lift"
			>
				<p class="text-sm text-slate-500 mb-3">
					{new Date(/** @type {string} */ (post.meta.date)).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
				<h2
					class="font-serif text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors"
				>
					{post.meta.title}
				</h2>
				<p class="text-slate-600 text-sm leading-relaxed">
					{post.meta.description}
				</p>
				<span class="inline-block mt-4 text-sm font-medium text-primary"> Read more &rarr; </span>
			</a>
		{/each}
	</div>
</Section>

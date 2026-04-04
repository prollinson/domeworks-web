<script lang="ts">
  import Section from '$lib/components/layout/Section.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>About - Ex-DoorDash, Square, Mudflap Engineering Leader | DomeWorks</title>
  <meta name="description" content="10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building the AI infrastructure layer for engineering teams." />
  <link rel="canonical" href="https://domeworks.ai/about/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.ai/about/" />
  <meta property="og:title" content="About - Ex-DoorDash, Square, Mudflap Engineering Leader | DomeWorks" />
  <meta property="og:description" content="10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building the AI infrastructure layer for engineering teams." />
  <meta property="og:image" content="https://domeworks.ai/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About - Ex-DoorDash, Square, Mudflap Engineering Leader | DomeWorks" />
  <meta name="twitter:description" content="10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building AI infrastructure for engineering teams." />
  <meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Piers Rollinson",
    "jobTitle": "Founder",
    "worksFor": { "@type": "Organization", "name": "DomeWorks" },
    "description": "10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building the AI infrastructure layer for engineering teams.",
    "url": "https://domeworks.ai/about/"
  })}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        I've been making engineering teams ship better for a decade<span class="text-primary">.</span> Now I do it with AI<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        I've spent the last decade leading engineering teams at DoorDash, Square, and Mudflap. Most of that time was spent figuring out how to make teams ship better, faster, and with less friction.
      </p>
    </div>
  </div>
</section>

<!-- Why DomeWorks Exists -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto" use:reveal>
    <p class="text-xs font-medium tracking-widest text-warm-gray uppercase mb-4">01</p>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-8">
      Why DomeWorks exists
    </h2>
    <div class="space-y-6 text-lg text-charcoal/70 leading-[1.65]">
      <p>
        Recently, that work shifted to AI. Not the hype cycle version - the engineering version. How do you take a team that has AI tools and make those tools actually change how the team ships?
      </p>
      <p>
        I watched the same pattern play out at every company: leadership buys Cursor licenses, rolls them out in a Slack announcement, maybe runs a lunch-and-learn. Three months later, adoption is at 15% and nobody can explain why.
      </p>
      <p>
        I can explain why. There's no intelligence infrastructure that replaces coordination overhead - nothing connecting the tools to how the team works. No shared context feeding into AI tools. No standard developer workflows automated around AI. No agent infrastructure connecting your codebase, tickets, and docs to how engineers actually ship.
      </p>
      <p class="border-l-2 border-copper pl-6 text-charcoal">
        Over 80% of organizations report no measurable impact on EBIT despite their AI investments <span class="text-charcoal/40">(BCG, 2024)</span>. Nobody is building the layer between the tools and the work. That's where DomeWorks operates.
      </p>
    </div>
  </div>
</Section>

<!-- How I Work -->
<Section background="white" padding="lg">
  <div class="max-w-2xl mx-auto" use:reveal>
    <p class="text-xs font-medium tracking-widest text-warm-gray uppercase mb-4">02</p>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-8">
      How I work
    </h2>

    <div class="space-y-8">
      <div class="flex gap-6">
        <span class="flex-shrink-0 text-xs font-medium text-primary tracking-widest">01</span>
        <div>
          <h3 class="font-medium text-charcoal mb-2">Embedded, not advisory</h3>
          <p class="text-charcoal/70 leading-[1.65]">I join your standups. I pair with your engineers. I sit in on planning. I write code, build systems, and ship alongside your team. You can't transfer capability from a slide deck.</p>
        </div>
      </div>

      <div class="flex gap-6">
        <span class="flex-shrink-0 text-xs font-medium text-primary tracking-widest">02</span>
        <div>
          <h3 class="font-medium text-charcoal mb-2">Designed to end</h3>
          <p class="text-charcoal/70 leading-[1.65]">Every engagement has a built-in exit. The goal is a team that has the systems they need and knows how to maintain them. The AI landscape moves fast - there's always a next phase to build, but you should be choosing it, not depending on me.</p>
        </div>
      </div>

      <div class="flex gap-6">
        <span class="flex-shrink-0 text-xs font-medium text-primary tracking-widest">03</span>
        <div>
          <h3 class="font-medium text-charcoal mb-2">Working systems over opinions</h3>
          <p class="text-charcoal/70 leading-[1.65]">I deliver running systems, not recommendations. Configured tools, documented workflows, measured before-and-after. Things your team can point to and build on.</p>
        </div>
      </div>
    </div>
  </div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Want to talk about your team?
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30 minutes, no obligation. I'll tell you whether this is something I can help with.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>

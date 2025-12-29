<script lang="ts">
  import Section from '$lib/components/layout/Section.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { generateSmbMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Process — Dome Works</title>
  <meta name="description" content="Our delivery lifecycle: Discovery > Design > Build > Deploy > Measure." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        Engineering, not hacking.
      </h1>
      <p class="mt-6 text-xl text-slate-600">
        We use a rigorous software engineering lifecycle to ensure your automation is robust, secure, and maintainable.
      </p>
    </div>
  </div>
</section>

<!-- Timeline -->
<Section background="muted" padding="lg">
  <div class="max-w-3xl mx-auto">
    {#each [
      {
        phase: '01',
        title: 'Discovery',
        goal: "We define 'Done' before we write a single line of code.",
        activities: ['Stakeholder interviews', 'Workflow observation', 'Tool inventory', 'Baseline metrics'],
        artifacts: ['Workflow map', 'Bottleneck analysis', 'Success criteria']
      },
      {
        phase: '02',
        title: 'Design',
        goal: 'We hunt for edge cases. What happens if the API is down? If the data is null?',
        activities: ['Solution architecture', 'Integration mapping', 'Exception handling design', 'Acceptance criteria'],
        artifacts: ['Architecture diagram', 'Integration inventory', 'Acceptance criteria doc']
      },
      {
        phase: '03',
        title: 'Build',
        goal: 'We build for failure. Retries, error queues, and alerts are standard, not optional.',
        activities: ['Core automation build', 'Integration setup', 'Error handling', 'Monitoring + alerting'],
        artifacts: ['Working automation', 'Alert configuration', 'Exception queue']
      },
      {
        phase: '04',
        title: 'Deploy',
        goal: 'No "fingers crossed" deployments. We test in staging and have a rollback plan.',
        activities: ['Staging validation', 'Production deployment', 'Rollback testing', 'Team training'],
        artifacts: ['Deployment runbook', 'Rollback procedure', 'Training materials']
      },
      {
        phase: '05',
        title: 'Measure',
        goal: 'We prove the ROI. Did we hit the baseline? If not, we tune it until we do.',
        activities: ['Metric tracking', 'Issue resolution', 'Optimization', 'Documentation updates'],
        artifacts: ['Performance report', 'Final documentation', 'Handoff checklist']
      }
    ] as item, i}
      <div class="mb-12 {i < 4 ? 'pb-12 border-b border-slate-200' : ''}">
        <div class="flex items-start gap-6">
          <span class="flex-shrink-0 text-2xl font-semibold text-primary">{item.phase}</span>
          <div class="flex-grow">
            <h3 class="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
            <p class="text-slate-600 mb-6">{item.goal}</p>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Activities</h4>
                <ul class="space-y-2">
                  {#each item.activities as activity}
                    <li class="flex items-center gap-2 text-sm text-slate-600">
                      <span class="w-1 h-1 rounded-full bg-slate-400"></span>
                      {activity}
                    </li>
                  {/each}
                </ul>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Artifacts</h4>
                <ul class="space-y-2">
                  {#each item.artifacts as artifact}
                    <li class="flex items-center gap-2 text-sm text-slate-700">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {artifact}
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Section>

<!-- CTA -->
<section class="bg-slate-900 text-white py-20">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl font-semibold mb-4">
      Ready to start?
    </h2>
    <p class="text-slate-400 mb-8">
      Email us your workflow. We'll tell you which phase you need.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us your workflow
    </Button>
  </div>
</section>

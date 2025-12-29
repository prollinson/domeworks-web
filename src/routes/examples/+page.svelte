<script lang="ts">
  import Section from '$lib/components/layout/Section.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { generateSmbMailto } from '$lib/utils/mailto'

  const examples = [
    {
      area: 'Sales',
      impact: 'Reduce lead response time from hours to minutes',
      workflow: 'HubSpot lead intake, routing, and follow-up',
      trigger: 'New form submission',
      tools: 'HubSpot, Slack, Gmail',
      time: '2–3 weeks'
    },
    {
      area: 'Operations',
      impact: 'Eliminate manual ticket creation and routing',
      workflow: 'Slack request intake, triage, and assignment',
      trigger: 'Message in #requests channel',
      tools: 'Slack, Notion, Calendar',
      time: '1–2 weeks'
    },
    {
      area: 'Management',
      impact: 'Save 4+ hours per week on report compilation',
      workflow: 'Weekly reporting autopilot',
      trigger: 'Scheduled (every Monday)',
      tools: 'Google Sheets, Slack, Email',
      time: '1–2 weeks'
    },
    {
      area: 'Finance',
      impact: 'Reduce invoice processing time by 80%',
      workflow: 'Invoice processing, approval, and payment',
      trigger: 'Email attachment received',
      tools: 'Gmail, QuickBooks, Slack',
      time: '3–4 weeks'
    },
    {
      area: 'HR',
      impact: 'Ensure consistent onboarding for every hire',
      workflow: 'Employee onboarding checklist',
      trigger: 'New hire start date',
      tools: 'BambooHR, Google Workspace, Slack',
      time: '2–3 weeks'
    },
    {
      area: 'Product',
      impact: 'Surface critical feedback within minutes',
      workflow: 'Customer feedback categorization and routing',
      trigger: 'Survey response or review',
      tools: 'Typeform, Notion, Slack',
      time: '1–2 weeks'
    },
    {
      area: 'Operations',
      impact: 'Prevent stockouts automatically',
      workflow: 'Inventory alerts, reorder, and confirmation',
      trigger: 'Stock below threshold',
      tools: 'Shopify, Slack, Email',
      time: '2–3 weeks'
    },
    {
      area: 'Operations',
      impact: 'Ensure every meeting has context and action items',
      workflow: 'Meeting scheduling, prep, and follow-up',
      trigger: 'Calendar event created',
      tools: 'Google Calendar, Notion, Gmail',
      time: '1–2 weeks'
    },
    {
      area: 'Support',
      impact: 'Reduce resolution time for urgent issues',
      workflow: 'Support ticket escalation',
      trigger: 'Ticket age > 24 hours',
      tools: 'Zendesk, Slack, PagerDuty',
      time: '1–2 weeks'
    },
    {
      area: 'Sales',
      impact: 'Never miss a renewal opportunity',
      workflow: 'Contract renewal reminders',
      trigger: '60 days before expiry',
      tools: 'Notion, Gmail, Calendar',
      time: '1 week'
    },
    {
      area: 'Marketing',
      impact: 'Consistent posting without manual effort',
      workflow: 'Social media content calendar',
      trigger: 'Scheduled post time',
      tools: 'Notion, Buffer, Slack',
      time: '2 weeks'
    },
    {
      area: 'Finance',
      impact: 'Faster reimbursements and fewer errors',
      workflow: 'Expense report approval and reimbursement',
      trigger: 'Report submitted',
      tools: 'Expensify, Slack, QuickBooks',
      time: '2–3 weeks'
    }
  ]
</script>

<svelte:head>
  <title>Examples — Dome Works</title>
  <meta name="description" content="Proven automation patterns that deliver measurable business results." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        Proven Automation Patterns
      </h1>
      <p class="mt-6 text-xl text-slate-600">
        We lead with the result. Here is the impact we have delivered using these established workflows.
      </p>
    </div>
  </div>
</section>

<!-- Examples Grid -->
<Section background="muted" padding="lg">
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each examples as example}
      <div class="bg-white rounded-xl border border-slate-200 p-6 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col">
        <span class="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded mb-4 w-fit">
          {example.area}
        </span>
        <h3 class="font-semibold text-slate-900 mb-6 text-lg leading-snug">{example.impact}</h3>
        <div class="space-y-3 text-sm mt-auto">
          <div class="pt-4 border-t border-slate-100">
            <p class="text-slate-500 mb-1 uppercase tracking-wider text-[10px] font-bold">Workflow</p>
            <p class="text-slate-900 font-medium">{example.workflow}</p>
          </div>
          <div>
            <p class="text-slate-500 mb-1 uppercase tracking-wider text-[10px] font-bold">Trigger</p>
            <p class="text-slate-700">{example.trigger}</p>
          </div>
          <div>
            <p class="text-slate-500 mb-1 uppercase tracking-wider text-[10px] font-bold">Tools</p>
            <p class="text-slate-700">{example.tools}</p>
          </div>
          <div>
            <p class="text-slate-500 mb-1 uppercase tracking-wider text-[10px] font-bold">Timeline</p>
            <p class="text-slate-700">{example.time}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Section>

<!-- Caveat -->
<Section background="white" padding="md">
  <div class="max-w-3xl mx-auto text-center">
    <p class="text-sm text-slate-500">
      These are base patterns. We customize the logic, exception handling, and human-in-the-loop steps to match your specific operating procedures.
    </p>
  </div>
</Section>

<!-- CTA -->
<section class="bg-slate-900 text-white py-20">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl font-semibold mb-4">
      Have a workflow in mind?
    </h2>
    <p class="text-slate-400 mb-8">
      Email us what you're trying to automate. We'll tell you what it takes.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us your workflow
    </Button>
  </div>
</section>

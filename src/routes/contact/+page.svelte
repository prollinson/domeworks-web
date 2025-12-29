<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import { generateSmbMailto, generateEnterpriseMailto } from '$lib/utils/mailto'

  let selectedLane: 'smb' | 'enterprise' = $state('smb')
</script>

<svelte:head>
  <title>Contact — Dome Works</title>
  <meta name="description" content="Email us your workflow or consulting needs." />
</svelte:head>

<section class="bg-white py-20 md:py-28">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
        Get in touch
      </h1>
      <p class="mt-4 text-lg text-slate-600">
        Select your path and email us directly.
      </p>
    </div>

    <!-- Lane Toggle -->
    <div class="flex justify-center mb-12">
      <div class="inline-flex bg-slate-100 rounded-lg p-1">
        <button
          onclick={() => selectedLane = 'smb'}
          class="px-6 py-2.5 text-sm font-medium rounded-md transition-all
            {selectedLane === 'smb' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        >
          Local Business
        </button>
        <button
          onclick={() => selectedLane = 'enterprise'}
          class="px-6 py-2.5 text-sm font-medium rounded-md transition-all
            {selectedLane === 'enterprise' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        >
          Enterprise
        </button>
      </div>
    </div>

    <!-- SMB Template -->
    {#if selectedLane === 'smb'}
      <div class="bg-slate-50 rounded-2xl p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">
          Automation inquiry
        </h2>
        <p class="text-slate-600 mb-6">
          Click the button below to open an email with this template pre-filled:
        </p>

        <div class="bg-white rounded-lg p-6 mb-6 border border-slate-200 font-mono text-sm text-slate-700 whitespace-pre-wrap">Subject: Automation Sprint — [workflow name]

Business type + team size:

            Workflow (start to end):
Bottlenecks (top 3):

Tools (Google/Slack/Microsoft/HubSpot + others):

Volume per week:

Success definition:

Budget band (target $5–15k):

Decision maker involved? (Yes/No):

Timing constraints:</div>

        <Button href={generateSmbMailto()} size="lg">
          Open email with template
        </Button>
      </div>
    {:else}
      <!-- Enterprise Template -->
      <div class="bg-slate-50 rounded-2xl p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">
          Enterprise consulting inquiry
        </h2>
        <p class="text-slate-600 mb-6">
          Click the button below to open an email with this template pre-filled:
        </p>

        <div class="bg-white rounded-lg p-6 mb-6 border border-slate-200 font-mono text-sm text-slate-700 whitespace-pre-wrap">Subject: AI Consulting — scope discussion

Goals:

Constraints (security/compliance):

Stakeholders (dev/IT/security):

Current stack:

Desired engagement model:

Timeline:

NDA required?:</div>

        <Button href={generateEnterpriseMailto()} size="lg">
          Open email with template
        </Button>
      </div>
    {/if}

    <p class="text-center text-sm text-slate-500 mt-8">
      If you're price shopping, we won't be the best fit.
    </p>
  </div>
</section>

<script lang="ts">
  let selectedLane: 'smb' | 'enterprise' = $state('smb')

  // Form fields
  let name = $state('')
  let email = $state('')
  let company = $state('')
  let companySize = $state('')
  let painPoints = $state('')
  let workflow = $state('')
  let tools = $state('')
  let budget = $state('')
  let timeline = $state('')

  // Enterprise-specific
  let constraints = $state('')
  let stakeholders = $state('')
  let engagementModel = $state('')
  let ndaRequired = $state('')

  let submitted = $state(false)

  const EMAIL = 'hello@domeworks.tech'

  function buildSmbMailto(): string {
    const subject = encodeURIComponent(`Automation Sprint — ${company || '[company name]'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nTeam size: ${companySize}\n\nWorkflow (start to end):\n${workflow}\n\nPain points / bottlenecks:\n${painPoints}\n\nTools (Google/Slack/Microsoft/HubSpot + others):\n${tools}\n\nBudget band (target $5-15k):\n${budget}\n\nTimeline:\n${timeline}`
    )
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  function buildEnterpriseMailto(): string {
    const subject = encodeURIComponent(`AI Consulting — ${company || 'scope discussion'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nTeam size: ${companySize}\n\nPain points / goals:\n${painPoints}\n\nConstraints (security/compliance):\n${constraints}\n\nStakeholders (dev/IT/security):\n${stakeholders}\n\nCurrent stack:\n${tools}\n\nDesired engagement model:\n${engagementModel}\n\nTimeline:\n${timeline}\n\nNDA required?: ${ndaRequired}`
    )
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  function handleSubmit() {
    const mailto = selectedLane === 'smb' ? buildSmbMailto() : buildEnterpriseMailto()
    submitted = true
    window.location.href = mailto
  }
</script>

<svelte:head>
  <title>Contact — Dome Works</title>
  <meta name="description" content="Tell us about your business and workflow challenges. We'll scope the right engagement." />
</svelte:head>

<section class="bg-white py-20 md:py-28">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
        Get in touch
      </h1>
      <p class="mt-4 text-lg text-slate-600">
        Tell us about your business. We'll scope the right engagement.
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

    {#if submitted}
      <div class="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-slate-900 mb-2">Your email client should have opened</h2>
        <p class="text-slate-600 mb-6">
          If it didn't, you can email us directly at <a href="mailto:{EMAIL}" class="text-primary hover:underline">{EMAIL}</a>.
        </p>
        <button
          onclick={() => submitted = false}
          class="text-sm text-primary hover:underline"
        >
          Fill out the form again
        </button>
      </div>
    {:else}
      <form
        onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        class="bg-slate-50 rounded-2xl p-8 space-y-6"
      >
        <!-- Contact Info -->
        <div class="grid sm:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
            <input
              id="name"
              type="text"
              bind:value={name}
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <!-- Company Info -->
        <div class="grid sm:grid-cols-2 gap-6">
          <div>
            <label for="company" class="block text-sm font-medium text-slate-700 mb-1.5">Company name</label>
            <input
              id="company"
              type="text"
              bind:value={company}
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label for="companySize" class="block text-sm font-medium text-slate-700 mb-1.5">Company size</label>
            <select
              id="companySize"
              bind:value={companySize}
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            >
              <option value="" disabled>Select team size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1,000 employees</option>
              <option value="1000+">1,000+ employees</option>
            </select>
          </div>
        </div>

        <!-- Pain Points -->
        <div>
          <label for="painPoints" class="block text-sm font-medium text-slate-700 mb-1.5">
            {selectedLane === 'smb' ? 'What are your biggest bottlenecks?' : 'What are your goals?'}
          </label>
          <textarea
            id="painPoints"
            bind:value={painPoints}
            required
            rows="3"
            class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
            placeholder={selectedLane === 'smb'
              ? 'Where does work pile up, get repeated, or fall through the cracks?'
              : 'What outcomes are you trying to achieve with AI/automation?'}
          ></textarea>
        </div>

        {#if selectedLane === 'smb'}
          <!-- SMB-specific fields -->
          <div>
            <label for="workflow" class="block text-sm font-medium text-slate-700 mb-1.5">Describe your workflow (start to end)</label>
            <textarea
              id="workflow"
              bind:value={workflow}
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
              placeholder="Lead comes in via form, gets added to spreadsheet, someone manually emails them..."
            ></textarea>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label for="tools" class="block text-sm font-medium text-slate-700 mb-1.5">Tools you use</label>
              <input
                id="tools"
                type="text"
                bind:value={tools}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Google Workspace, Slack, HubSpot..."
              />
            </div>
            <div>
              <label for="budget" class="block text-sm font-medium text-slate-700 mb-1.5">Budget range</label>
              <select
                id="budget"
                bind:value={budget}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="" disabled>Select range</option>
                <option value="$3,500-$7,500">$3,500-$7,500 (Audit)</option>
                <option value="$9,500-$15,000">$9,500-$15,000 (Sprint)</option>
                <option value="$15,000-$24,000">$15,000-$24,000 (Sprint)</option>
                <option value="$24,000+">$24,000+ (Complex)</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>
        {:else}
          <!-- Enterprise-specific fields -->
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label for="tools-ent" class="block text-sm font-medium text-slate-700 mb-1.5">Current stack</label>
              <input
                id="tools-ent"
                type="text"
                bind:value={tools}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="AWS, Azure, Snowflake..."
              />
            </div>
            <div>
              <label for="stakeholders" class="block text-sm font-medium text-slate-700 mb-1.5">Key stakeholders</label>
              <input
                id="stakeholders"
                type="text"
                bind:value={stakeholders}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Engineering, IT, Security..."
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label for="constraints" class="block text-sm font-medium text-slate-700 mb-1.5">Constraints (security/compliance)</label>
              <input
                id="constraints"
                type="text"
                bind:value={constraints}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="SOC 2, HIPAA, on-prem only..."
              />
            </div>
            <div>
              <label for="engagementModel" class="block text-sm font-medium text-slate-700 mb-1.5">Engagement model</label>
              <select
                id="engagementModel"
                bind:value={engagementModel}
                class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="" disabled>Select model</option>
                <option value="Advisory">Advisory / strategy</option>
                <option value="Embedded">Embedded consulting</option>
                <option value="Project-based">Project-based delivery</option>
                <option value="Not sure">Not sure yet</option>
              </select>
            </div>
          </div>

          <div>
            <label for="ndaRequired" class="block text-sm font-medium text-slate-700 mb-1.5">NDA required?</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" bind:group={ndaRequired} value="Yes" class="accent-primary" />
                <span class="text-sm text-slate-700">Yes</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" bind:group={ndaRequired} value="No" class="accent-primary" />
                <span class="text-sm text-slate-700">No</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" bind:group={ndaRequired} value="TBD" class="accent-primary" />
                <span class="text-sm text-slate-700">TBD</span>
              </label>
            </div>
          </div>
        {/if}

        <!-- Timeline (shared) -->
        <div>
          <label for="timeline" class="block text-sm font-medium text-slate-700 mb-1.5">Timeline</label>
          <input
            id="timeline"
            type="text"
            bind:value={timeline}
            class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="ASAP, next quarter, exploratory..."
          />
        </div>

        <!-- Submit -->
        <div class="pt-2">
          <button
            type="submit"
            class="inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-[0_4px_14px_-2px_rgba(13,148,136,0.35)] px-8 py-4 text-lg"
          >
            Send inquiry via email
          </button>
          <p class="text-xs text-slate-500 mt-3">
            Opens your email client with the details pre-filled. No data is stored on our servers.
          </p>
        </div>
      </form>
    {/if}

    <p class="text-center text-sm text-slate-500 mt-8">
      If you're price shopping, we won't be the best fit.
    </p>
  </div>
</section>

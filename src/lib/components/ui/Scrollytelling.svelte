<script lang="ts">
  import { reveal } from '$lib/actions/reveal'

  // Track which step is active based on scroll
  let activeStep = $state(0)
  let containerRef: HTMLElement

  const steps = [
    {
      number: '01',
      title: 'Discovery',
      description: 'We map your current workflow end-to-end. Where does data enter? Where does it get stuck? What falls through the cracks?',
      visual: 'discovery'
    },
    {
      number: '02',
      title: 'Design',
      description: 'We architect the automation: integrations, error handling, monitoring, and human checkpoints where they matter.',
      visual: 'design'
    },
    {
      number: '03',
      title: 'Build & Test',
      description: 'Implementation with real test cases. Every edge case documented. Every failure mode handled.',
      visual: 'build'
    },
    {
      number: '04',
      title: 'Deploy & Handoff',
      description: 'Roll out with monitoring from day one. Full documentation. You own it completely.',
      visual: 'deploy'
    }
  ]

  // Intersection observer to track active step
  function setupObserver(node: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0')
            activeStep = stepIndex
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    const stepElements = node.querySelectorAll('[data-step]')
    stepElements.forEach((el) => observer.observe(el))

    return {
      destroy() {
        observer.disconnect()
      }
    }
  }
</script>

<div class="relative" use:setupObserver bind:this={containerRef}>
  <div class="grid lg:grid-cols-2 gap-8 lg:gap-16">
    <!-- Left: Scrolling Text Steps -->
    <div class="space-y-32 lg:space-y-48 py-8">
      {#each steps as step, i}
        <div
          data-step={i}
          class="min-h-[50vh] flex items-center transition-opacity duration-500 {activeStep === i ? 'opacity-100' : 'opacity-40'}"
        >
          <div>
            <span class="text-sm font-medium tracking-widest text-primary uppercase mb-4 block">
              {step.number}
            </span>
            <h3 class="text-2xl md:text-3xl font-serif font-semibold text-slate-900 mb-4">
              {step.title}
            </h3>
            <p class="text-lg text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Right: Sticky Visual -->
    <div class="hidden lg:block">
      <div class="sticky top-32 h-[60vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
        <!-- Discovery Visual -->
        <div
          class="absolute inset-0 p-8 transition-all duration-700 {activeStep === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}"
        >
          <div class="h-full flex flex-col">
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Current State</span>
            <div class="flex-1 relative">
              <!-- Messy sticky notes / whiteboard look -->
              <div class="absolute top-4 left-4 w-24 h-24 bg-yellow-200 rounded shadow-lg rotate-3 p-2">
                <div class="text-xs text-yellow-900 font-mono">TODO: Check email</div>
              </div>
              <div class="absolute top-8 left-32 w-28 h-20 bg-pink-200 rounded shadow-lg -rotate-2 p-2">
                <div class="text-xs text-pink-900 font-mono">Follow up with John???</div>
              </div>
              <div class="absolute top-20 right-8 w-24 h-24 bg-blue-200 rounded shadow-lg rotate-1 p-2">
                <div class="text-xs text-blue-900 font-mono">Update spreadsheet</div>
              </div>
              <div class="absolute bottom-16 left-12 w-32 h-16 bg-green-200 rounded shadow-lg -rotate-1 p-2">
                <div class="text-xs text-green-900 font-mono">WHERE IS THE FILE?!</div>
              </div>
              <div class="absolute bottom-8 right-16 w-28 h-20 bg-orange-200 rounded shadow-lg rotate-2 p-2">
                <div class="text-xs text-orange-900 font-mono">Ask Sarah again</div>
              </div>
              <!-- Question marks floating -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-slate-700 opacity-20 animate-pulse">
                ?
              </div>
            </div>
          </div>
        </div>

        <!-- Design Visual -->
        <div
          class="absolute inset-0 p-8 transition-all duration-700 {activeStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}"
        >
          <div class="h-full flex flex-col">
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Architecture</span>
            <div class="flex-1 flex items-center justify-center">
              <svg viewBox="0 0 300 200" class="w-full h-full max-w-md">
                <!-- Clean flowchart -->
                <rect x="20" y="80" width="60" height="40" rx="4" fill="rgb(13, 148, 136)" class="node-pulse-teal" />
                <text x="50" y="105" text-anchor="middle" fill="white" font-size="10">Input</text>

                <line x1="80" y1="100" x2="110" y2="100" stroke="rgb(13, 148, 136)" stroke-width="2" />
                <polygon points="110,95 120,100 110,105" fill="rgb(13, 148, 136)" />

                <rect x="120" y="80" width="60" height="40" rx="4" fill="rgb(13, 148, 136)" />
                <text x="150" y="105" text-anchor="middle" fill="white" font-size="10">Process</text>

                <line x1="180" y1="100" x2="210" y2="100" stroke="rgb(13, 148, 136)" stroke-width="2" />
                <polygon points="210,95 220,100 210,105" fill="rgb(13, 148, 136)" />

                <rect x="220" y="80" width="60" height="40" rx="4" fill="rgb(13, 148, 136)" />
                <text x="250" y="105" text-anchor="middle" fill="white" font-size="10">Output</text>

                <!-- Error handling branch -->
                <line x1="150" y1="120" x2="150" y2="150" stroke="rgb(251, 146, 60)" stroke-width="2" stroke-dasharray="4" />
                <rect x="120" y="150" width="60" height="30" rx="4" fill="rgb(251, 146, 60)" />
                <text x="150" y="170" text-anchor="middle" fill="white" font-size="8">Error Handler</text>

                <!-- Monitoring -->
                <circle cx="250" y="40" r="20" fill="rgba(13, 148, 136, 0.2)" stroke="rgb(13, 148, 136)" stroke-width="1" />
                <text x="250" y="44" text-anchor="middle" fill="rgb(13, 148, 136)" font-size="8">Monitor</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Build Visual -->
        <div
          class="absolute inset-0 p-8 transition-all duration-700 {activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}"
        >
          <div class="h-full flex flex-col">
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Implementation</span>
            <div class="flex-1 font-mono text-xs text-slate-400 overflow-hidden">
              <div class="space-y-1 animate-code-scroll">
                <div><span class="text-purple-400">async</span> <span class="text-blue-400">function</span> <span class="text-yellow-300">processWorkflow</span>() {'{'}</div>
                <div class="pl-4"><span class="text-purple-400">const</span> input = <span class="text-purple-400">await</span> <span class="text-yellow-300">getInput</span>();</div>
                <div class="pl-4"></div>
                <div class="pl-4"><span class="text-purple-400">try</span> {'{'}</div>
                <div class="pl-8"><span class="text-purple-400">const</span> validated = <span class="text-yellow-300">validate</span>(input);</div>
                <div class="pl-8"><span class="text-purple-400">const</span> result = <span class="text-purple-400">await</span> <span class="text-yellow-300">process</span>(validated);</div>
                <div class="pl-8"><span class="text-purple-400">await</span> <span class="text-yellow-300">notify</span>(<span class="text-green-400">'success'</span>);</div>
                <div class="pl-8"><span class="text-purple-400">return</span> result;</div>
                <div class="pl-4">{'}'} <span class="text-purple-400">catch</span> (error) {'{'}</div>
                <div class="pl-8"><span class="text-purple-400">await</span> <span class="text-yellow-300">logError</span>(error);</div>
                <div class="pl-8"><span class="text-purple-400">await</span> <span class="text-yellow-300">alertOps</span>(error);</div>
                <div class="pl-8"><span class="text-purple-400">throw</span> error;</div>
                <div class="pl-4">{'}'}</div>
                <div>{'}'}</div>
                <div class="mt-4 text-green-400">// Tests passing: 47/47</div>
                <div class="text-green-400">// Coverage: 94%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deploy Visual -->
        <div
          class="absolute inset-0 p-8 transition-all duration-700 {activeStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}"
        >
          <div class="h-full flex flex-col">
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Live Dashboard</span>
            <div class="flex-1 space-y-4">
              <!-- Status bar -->
              <div class="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-green-400 status-dot"></span>
                  <span class="text-sm text-white">Production</span>
                </div>
                <span class="text-xs text-slate-400">Uptime: 99.9%</span>
              </div>

              <!-- Metrics -->
              <div class="grid grid-cols-3 gap-3">
                <div class="p-3 bg-slate-800 rounded-lg text-center">
                  <div class="text-2xl font-bold text-primary counter-animate">1,247</div>
                  <div class="text-xs text-slate-500">Runs today</div>
                </div>
                <div class="p-3 bg-slate-800 rounded-lg text-center">
                  <div class="text-2xl font-bold text-green-400">2.3s</div>
                  <div class="text-xs text-slate-500">Avg time</div>
                </div>
                <div class="p-3 bg-slate-800 rounded-lg text-center">
                  <div class="text-2xl font-bold text-white">0</div>
                  <div class="text-xs text-slate-500">Errors</div>
                </div>
              </div>

              <!-- Activity feed -->
              <div class="flex-1 p-3 bg-slate-800 rounded-lg overflow-hidden">
                <div class="text-xs text-slate-500 mb-2">Recent Activity</div>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>Workflow completed - Lead #4521</span>
                    <span class="ml-auto text-slate-600">2s ago</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>Workflow completed - Lead #4520</span>
                    <span class="ml-auto text-slate-600">8s ago</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>Workflow completed - Lead #4519</span>
                    <span class="ml-auto text-slate-600">15s ago</span>
                  </div>
                </div>
              </div>

              <!-- Handoff badge -->
              <div class="p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div class="text-sm font-medium text-white">You own this</div>
                  <div class="text-xs text-slate-400">Full docs + admin access transferred</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .node-pulse-teal {
    animation: pulse-teal 2s ease-in-out infinite;
  }

  @keyframes pulse-teal {
    0%, 100% { filter: drop-shadow(0 0 0 rgba(13, 148, 136, 0)); }
    50% { filter: drop-shadow(0 0 8px rgba(13, 148, 136, 0.5)); }
  }

  .animate-code-scroll {
    animation: code-scroll 20s linear infinite;
  }

  @keyframes code-scroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }

  .counter-animate {
    animation: counter-pulse 2s ease-in-out infinite;
  }

  @keyframes counter-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
</style>

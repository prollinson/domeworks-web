<script lang="ts">
  import { generateSmbMailto, generateEnterpriseMailto } from '$lib/utils/mailto'

  // Live Las Vegas time (Pacific Time)
  let vegasTime = $state('')
  let statusText = $state('Accepting Clients')

  function updateTime() {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
    vegasTime = now.toLocaleTimeString('en-US', options)

    // Update status based on business hours (9 AM - 6 PM PT, Mon-Fri)
    const vegasNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    const hour = vegasNow.getHours()
    const day = vegasNow.getDay()
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 9 && hour < 18
    statusText = isBusinessHours ? 'Online Now' : 'Accepting Clients'
  }

  $effect(() => {
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  })

  const navLinks = [
    { href: '/services/', label: 'Services' },
    { href: '/enterprise/', label: 'Enterprise' },
    { href: '/process/', label: 'Process' },
    { href: '/examples/', label: 'Examples' }
  ]

  const companyLinks = [
    { href: '/security/', label: 'Security' },
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' }
  ]
</script>

<footer class="bg-slate-950 text-white relative overflow-hidden">
  <!-- Ambient lighting -->
  <div class="absolute inset-0 ambient-warm opacity-50"></div>
  <div class="absolute inset-0 texture-grain"></div>

  <!-- Main CTA Section -->
  <div class="relative border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
      <div class="max-w-4xl">
        <h2 class="footer-headline font-serif font-semibold text-white mb-8">
          Ready to<br class="hidden sm:block" /> automate?
        </h2>
        <p class="text-lg md:text-xl text-slate-400 max-w-xl mb-10">
          Tell us what's slowing you down. We'll show you exactly how to fix it.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href={generateSmbMailto()}
            class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all active:scale-[0.98]"
          >
            Start a conversation
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={generateEnterpriseMailto()}
            class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 rounded-lg transition-all active:scale-[0.98]"
          >
            Enterprise inquiries
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Info Grid -->
  <div class="relative">
    <div class="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        <!-- Brand & Status -->
        <div class="col-span-2 md:col-span-1">
          <a href="/" class="text-xl font-semibold tracking-tight">
            Dome Works
          </a>
          <div class="mt-6 flex items-center gap-2">
            <span class="status-dot w-2 h-2 rounded-full bg-primary"></span>
            <span class="text-sm text-slate-400">{statusText}</span>
          </div>
          <p class="mt-2 text-sm text-slate-500 font-mono">
            {vegasTime} PT
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">
            Services
          </h4>
          <ul class="space-y-3">
            {#each navLinks as link}
              <li>
                <a
                  href={link.href}
                  class="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">
            Company
          </h4>
          <ul class="space-y-3">
            {#each companyLinks as link}
              <li>
                <a
                  href={link.href}
                  class="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Location -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">
            Location
          </h4>
          <p class="text-sm text-slate-400">
            Las Vegas Valley<br />
            Nevada, USA
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Dome Works. All rights reserved.
        </p>
        <p class="text-xs text-slate-600">
          Premium automation for businesses that value reliability.
        </p>
      </div>
    </div>
  </div>
</footer>

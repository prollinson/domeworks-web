<script lang="ts">
  import { getBookCallUrl } from '$lib/utils/mailto'

  const navLinks = [
    { href: '/scan/', label: 'AI Scan' },
    { href: '/assessment/', label: 'Assessment' },
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' }
  ]
</script>

<footer class="bg-ink text-white relative overflow-hidden">
  <div class="absolute inset-0 ambient-warm opacity-50"></div>
  <div class="absolute inset-0 texture-grain"></div>

  <!-- Main CTA Section -->
  <div class="relative border-b border-white/10">
    <div class="max-w-6xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
      <div class="max-w-4xl">
        <h2 class="footer-headline font-serif font-normal text-white mb-8">
          Let's figure out<br class="hidden sm:block" /> what's missing<span class="text-primary">.</span>
        </h2>
        <p class="text-lg md:text-xl text-warm-gray max-w-xl mb-10">
          30 minutes on a call and I can tell you whether your team's AI adoption is a tooling problem or a systems problem.
        </p>
        <a
          href={getBookCallUrl()}
          class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-charcoal bg-warm-white hover:bg-stone rounded-lg transition-all active:scale-[0.98]"
        >
          Book a discovery call
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </div>

  <!-- Info Grid -->
  <div class="relative">
    <div class="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <a href="/" class="text-xl font-medium tracking-tight">
            DomeWorks
          </a>
          <p class="mt-4 text-sm text-warm-gray-light">
            AI infrastructure engineering<br />for teams that ship.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-warm-gray-light mb-5">
            Services
          </p>
          <ul class="space-y-3">
            {#each navLinks as link}
              <li>
                <a
                  href={link.href}
                  class="text-sm text-warm-gray-light hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Background -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-warm-gray-light mb-5">
            Background
          </p>
          <ul class="space-y-3">
            <li><span class="text-sm text-warm-gray-light">Ex-DoorDash</span></li>
            <li><span class="text-sm text-warm-gray-light">Ex-Square</span></li>
            <li><span class="text-sm text-warm-gray-light">10+ years eng leadership</span></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-warm-gray-light mb-5">
            Contact
          </p>
          <p class="text-sm text-warm-gray-light">
            piers@domeworks.tech
          </p>
          <p class="mt-2 text-sm text-warm-gray-light">
            Remote / US-based
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-warm-gray">
          &copy; {new Date().getFullYear()} DomeWorks. All rights reserved.
        </p>
        <p class="text-xs text-warm-gray">
          Making AI work at the team level.
        </p>
      </div>
    </div>
  </div>
</footer>

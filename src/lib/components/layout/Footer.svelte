<script lang="ts">
  import { generateSmbMailto, generateEnterpriseMailto } from '$lib/utils/mailto'

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

<footer class="bg-slate-900 text-white">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-24">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <!-- Brand -->
      <div class="lg:col-span-1">
        <a href="/" class="text-xl font-semibold tracking-tight">
          Dome Works
        </a>
        <p class="mt-4 text-sm text-slate-400 leading-relaxed">
          Real automation for Las Vegas Valley businesses. Built for your bottlenecks and your tools.
        </p>
      </div>

      <!-- Navigation -->
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
          Services
        </h4>
        <ul class="space-y-4">
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
        <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
          Company
        </h4>
        <ul class="space-y-4">
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

      <!-- Contact -->
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-6">
          Get Started
        </h4>
        <div class="space-y-4">
          <a
            href={generateSmbMailto()}
            class="block text-sm text-slate-400 hover:text-white transition-colors"
          >
            Email us your workflow
          </a>
          <a
            href={generateEnterpriseMailto()}
            class="block text-sm text-slate-400 hover:text-white transition-colors"
          >
            Enterprise inquiries
          </a>
        </div>
        <p class="mt-6 text-xs text-slate-500">
          Las Vegas Valley, Nevada
        </p>
      </div>
    </div>

    <!-- Bottom -->
    <div class="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Dome Works. All rights reserved.
      </p>
      <p class="text-xs text-slate-600">
        Premium automation for businesses that value reliability.
      </p>
    </div>
  </div>
</footer>

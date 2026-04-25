/**
 * SMB campaign registry.
 *
 * Powers the /smb/ landing page (default campaign) and /smb/[slug]/ personalized
 * cold-outreach pages. Add a new entry here and the route is prerendered on the
 * next build — no new page file needed.
 *
 * Overrides are all optional; anything unset falls back to the generic copy on
 * the assessment page.
 */

export type Vertical =
	| 'generic'
	| 'accounting'
	| 'legal'
	| 'medical'
	| 'trades'
	| 'real-estate'
	| 'agency'
	| 'consulting'
	| 'ecommerce'
	| 'insurance'
	| 'mortgage';

export type Campaign = {
	/** Slug used in URL. Omit for the default (/smb/) campaign. */
	slug?: string;

	/** Preselect the "Where the time goes" vertical filter. Defaults to 'generic'. */
	vertical?: Vertical;

	/**
	 * Hide the vertical picker entirely so the reader can't switch away.
	 * Defaults to true on any campaign that sets a non-generic `vertical`
	 * (Tier A and Tier B pages both lock by default). Pass `false` to force
	 * the picker back on.
	 */
	lockVertical?: boolean;

	/** Hide from search engines. Defaults to true for /smb/[slug]/ pages. */
	noIndex?: boolean;

	// ─── Personalization (optional, shown in hero if provided) ────────────────
	/** Name of the recipient, e.g. "Sarah". Used in the opening line. */
	recipientName?: string;
	/** Business or firm name, e.g. "Vegas Valley Dental". */
	businessName?: string;
	/** City or region, e.g. "Henderson". */
	location?: string;

	// ─── Hero overrides ───────────────────────────────────────────────────────
	/** Eyebrow above the headline, e.g. "For Henderson HVAC owners". */
	heroEyebrow?: string;
	/** Meta line next to the eyebrow, e.g. "Services businesses · 10–50 people". */
	heroMeta?: string;
	/** Main headline. */
	heroHeadline?: string;
	/** Sub-headline (serif paragraph under the H1). */
	heroSubhead?: string;
	/** Small line below the subhead. Defaults to the ex-DoorDash line. */
	heroKicker?: string;

	// ─── SEO ──────────────────────────────────────────────────────────────────
	/** <title>. Defaults to a generic assessment title. */
	title?: string;
	/** Meta description. */
	description?: string;
	/** Canonical URL. Computed from slug if omitted. */
	canonical?: string;

	// ─── CTA override ─────────────────────────────────────────────────────────
	/** Override the Cal.com booking URL (useful for per-campaign UTM tracking). */
	ctaUrl?: string;

	// ─── Pattern override ─────────────────────────────────────────────────────
	/**
	 * Replace the pain cards shown when this campaign's vertical is selected.
	 * If omitted, the built-in pattern for `vertical` is used.
	 */
	patternOverride?: {
		label?: string;
		lead?: string;
		leadsWithSpeed?: boolean;
		cards?: Array<{ title: string; body: string }>;
	};
};

/**
 * The default campaign — what renders at /smb/ and backs anything unset in
 * named campaigns.
 */
export const defaultCampaign: Campaign = {
	vertical: 'generic',
	noIndex: false,
	title: 'AI Tools Assessment for Services Firms | DomeWorks',
	description:
		"A 45-minute assessment of where AI tools fit in your services business — and the workflows where they'd do more harm than good. For owner-operated firms with 10–50 people.",
	canonical: 'https://domeworks.tech/smb/'
};

/**
 * Named campaigns. Keys are URL slugs (lowercased, hyphenated).
 *
 * EXAMPLE shows the full set of overrides. Duplicate + customize for each
 * cold-outreach target.
 */
export const campaigns: Record<string, Campaign> = {
	// ─── Tier A · vertical landing pages (indexed, public) ────────────────────
	// Linked from LinkedIn content, chamber posts, and referral conversations.
	// Keep copy close to the outreach voice for each vertical.

	cpa: {
		slug: 'cpa',
		vertical: 'accounting',
		noIndex: false,
		heroEyebrow: 'For Henderson & Las Vegas CPA firms',
		heroMeta: 'Accounting, bookkeeping & tax · 5–50 people',
		heroHeadline: '5–7 hours back each week — from intake, drafting, and document chasing.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on where AI recovers hours in your firm — <strong class="text-accent-light font-medium font-serif">and where it shouldn\'t go near your workpapers</strong>.',
		heroKicker: 'Ex-DoorDash, Square, Mudflap. AICPA relationship — I know your world.',
		title: 'AI Tools Assessment for Henderson & Las Vegas CPA Firms | DomeWorks',
		description:
			"Where AI recovers hours in a CPA firm — and where it shouldn't touch your workpapers. 45-min call, written plan in 48 hours. Henderson local, AICPA relationship."
	},

	law: {
		slug: 'law',
		vertical: 'legal',
		noIndex: false,
		heroEyebrow: 'For Henderson & Las Vegas law firms',
		heroMeta: 'Injury, defense, transactional · 3–30 people',
		heroHeadline: 'Keep billable hours on the matter — not on the intake form.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on what AI drafts well, what it handles badly, <strong class="text-accent-light font-medium font-serif">and what stays human</strong>.',
		heroKicker:
			"Ex-DoorDash, Square, Mudflap. I won't tell you to automate anything that touches client confidentiality or judgment.",
		title: 'AI Tools Assessment for Henderson & Las Vegas Law Firms | DomeWorks',
		description:
			'Where AI drafts well in a law firm, what it handles badly, and what stays human. 45-min call, written plan in 48 hours. Henderson local.'
	},

	insurance: {
		slug: 'insurance',
		vertical: 'insurance',
		noIndex: false,
		heroEyebrow: 'For Henderson & Las Vegas insurance agencies',
		heroMeta: 'Independent agencies · 2–25 people',
		heroHeadline:
			'Quote faster. Follow up without burning Saturday. Keep the clients you already have.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on the 3–7 tools that actually move quote time <strong class="text-accent-light font-medium font-serif">and keep renewals from slipping</strong>.',
		heroKicker:
			'Ex-DoorDash, Square, Mudflap. Speed-to-lead is usually the #1 win in this business — and the easiest to fix.',
		title: 'AI Tools Assessment for Insurance Agencies | DomeWorks',
		description:
			'Where AI recovers quote time and keeps renewals from slipping. 45-min call, written plan in 48 hours. For independent insurance agencies in Henderson & Las Vegas.'
	},

	dental: {
		slug: 'dental',
		vertical: 'medical',
		noIndex: false,
		heroEyebrow: 'For Henderson & Las Vegas dental practices',
		heroMeta: 'Independent practices · 1–5 operatories',
		heroHeadline: 'Fewer no-shows. Faster intake. More reviews — without running a raffle.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on what to install in a practice — <strong class="text-accent-light font-medium font-serif">and what shouldn\'t come near patient records</strong>.',
		heroKicker:
			"Ex-DoorDash, Square, Mudflap. I'll also tell you what's holding your Google Maps back — that's usually the bigger win.",
		title: 'AI Tools Assessment for Henderson & Las Vegas Dental Practices | DomeWorks',
		description:
			'Fewer no-shows, faster intake, more reviews — without the raffle. 45-min call, written plan in 48 hours. For Henderson dental practices.'
	},

	'dental-group': {
		slug: 'dental-group',
		vertical: 'medical',
		noIndex: false,
		heroEyebrow: 'For Las Vegas multi-location dental groups',
		heroMeta: 'DSOs & emerging groups · 3–30 locations',
		heroHeadline: 'One playbook across every location. Without a corporate trainer at each site.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on where AI replaces the ops overhead between locations — <strong class="text-accent-light font-medium font-serif">and where centralizing actually slows the chair down</strong>.',
		heroKicker:
			'Ex-DoorDash, Square, Mudflap. Same thinking that scaled 10,000+ merchant locations; applied to your group.',
		title: 'AI Tools Assessment for Multi-Location Dental Groups | DomeWorks',
		description:
			'Where AI replaces ops overhead between dental locations — and where centralizing slows down patient care. 45-min call, written plan in 48 hours. For Las Vegas DSOs and emerging groups.'
	},

	'real-estate': {
		slug: 'real-estate',
		vertical: 'real-estate',
		noIndex: false,
		heroEyebrow: 'For real estate agents and teams',
		heroMeta: 'Agents, teams, brokerages · 1–30 people',
		heroHeadline:
			'The first agent to reply usually closes. Be that agent — without living on your phone.',
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on where AI earns its keep in a real-estate team — <strong class="text-accent-light font-medium font-serif">and where it burns client trust</strong>.',
		heroKicker:
			'Ex-DoorDash, Square, Mudflap. Same thinking that lands ten million orders at DoorDash; applied to your pipeline.',
		title: 'AI Tools Assessment for Real Estate Teams | DomeWorks',
		description:
			'Where AI earns its keep in a real-estate team — and where it burns client trust. 45-min call, written plan in 48 hours.'
	},

	'mortgage-broker': {
		slug: 'mortgage-broker',
		vertical: 'mortgage',
		noIndex: false,
		heroEyebrow: 'For mortgage brokers',
		heroMeta: 'Residential + complex lending · 2–20 people',
		heroHeadline: "Collect docs once. Submit faster. Never lose a file to 'who's chasing what?'",
		heroSubhead:
			'A 45-minute call. A written plan in 48 hours on where AI actually helps a broker — <strong class="text-accent-light font-medium font-serif">and where the compliance cost isn\'t worth it</strong>.',
		heroKicker:
			'Ex-DoorDash, Square, Mudflap. Built systems moving millions of docs at scale; same thinking for your pipeline.',
		title: 'AI Tools Assessment for Mortgage Brokers | DomeWorks',
		description:
			"Where AI helps a broker — and where compliance cost isn't worth it. 45-min call, written plan in 48 hours. For mortgage brokers running complex lending."
	},

	// ─── Tier B · prospect-specific landing pages (noindex) ───────────────────
	// Used for cold outreach to named prospects. Duplicate + customize.

	example: {
		slug: 'example',
		vertical: 'trades',
		noIndex: true,
		recipientName: 'Sam',
		businessName: 'Example HVAC',
		location: 'Henderson',
		heroEyebrow: 'For Example HVAC',
		heroMeta: 'A 45-minute read on where AI fits in your service business',
		heroHeadline: "Sam — here's where AI would actually pay for Example HVAC.",
		heroSubhead:
			'A 45-minute call. An action plan <strong class="text-accent-light font-medium font-serif">you can start this week</strong>. What to install, what to skip.',
		heroKicker:
			"I'm Piers — ex-DoorDash/Square. I live in Henderson. Built this for firms like yours."
	}
};

export function getCampaign(slug: string): Campaign | null {
	return campaigns[slug] ?? null;
}

export function getCampaignSlugs(): string[] {
	return Object.keys(campaigns);
}

/** Merge a named campaign onto the default so consumers always see a full Campaign. */
export function resolveCampaign(slug?: string): Campaign {
	if (!slug) return defaultCampaign;
	const c = campaigns[slug];
	if (!c) return defaultCampaign;
	return {
		...defaultCampaign,
		...c,
		noIndex: c.noIndex ?? true,
		canonical: c.canonical ?? `https://domeworks.tech/smb/${slug}/`
	};
}

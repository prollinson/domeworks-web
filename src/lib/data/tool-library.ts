/**
 * Runtime mirror of `/Users/piers/piers-os/resources/domeworks/smb-audit/tool-library.yaml`.
 * The YAML is the human-editable canonical source; this module is what the Cloudflare
 * Worker bundles. Keep them in sync. When the YAML changes, regenerate this file.
 */
export type Complexity = 'plug-and-play' | 'some-setup' | 'project';

export type GovernanceRisk = 'standard' | 'cleared-with-baa' | 'on-device';

export type PainArea =
	| 'admin'
	| 'marketing-and-lead-response'
	| 'client-delivery'
	| 'mixed'
	| 'meeting-notes'
	| 'action-item-capture'
	| 'email-overload'
	| 'reporting'
	| 'document-drafting'
	| 'scheduling'
	| 'intake'
	| 'correspondence'
	| 'bookkeeping-review'
	| 'compliance'
	| 'design-production'
	| 'customer-support'
	| 'crm-hygiene'
	| 'sales-outreach'
	| 'research';

export type IndustrySlug =
	| 'accounting'
	| 'legal'
	| 'medical-or-dental'
	| 'trades'
	| 'real-estate'
	| 'marketing-creative'
	| 'consulting'
	| 'ecommerce'
	| 'other-professional-services'
	| 'insurance'
	| 'mortgage-broker'
	| 'all';

export interface ToolEntry {
	id: string;
	name: string;
	category: string;
	hours_saved_per_week_range: [number, number];
	monthly_cost: number;
	complexity: Complexity;
	setup_time_minutes: number;
	fits_industries: IndustrySlug[];
	fits_pain_areas: PainArea[];
	governance_risk: GovernanceRisk;
	notes: string;
}

export const TOOL_LIBRARY: ToolEntry[] = [
	{
		id: 'fathom',
		name: 'Fathom',
		category: 'meeting-notes',
		hours_saved_per_week_range: [1, 3],
		monthly_cost: 0,
		complexity: 'plug-and-play',
		setup_time_minutes: 15,
		fits_industries: ['all'],
		fits_pain_areas: ['meeting-notes', 'action-item-capture', 'client-delivery'],
		governance_risk: 'standard',
		notes:
			'Free tier records and summarizes Zoom, Meet, and Teams calls with action-item extraction. Pro tier at twenty four dollars a month adds team coaching analytics. Integrates with most CRMs.'
	},
	{
		id: 'sanebox',
		name: 'SaneBox',
		category: 'email-triage',
		hours_saved_per_week_range: [2, 5],
		monthly_cost: 14,
		complexity: 'plug-and-play',
		setup_time_minutes: 30,
		fits_industries: ['all'],
		fits_pain_areas: ['admin', 'email-overload', 'correspondence'],
		governance_risk: 'standard',
		notes:
			'Sorts low-priority email out of the inbox. Lunch tier is the typical owner-operator fit. Works with any IMAP or Gmail account, no plugin required.'
	},
	{
		id: 'dashthis',
		name: 'DashThis',
		category: 'marketing-reporting',
		hours_saved_per_week_range: [1, 3],
		monthly_cost: 42,
		complexity: 'some-setup',
		setup_time_minutes: 90,
		fits_industries: ['marketing-creative', 'real-estate', 'ecommerce', 'consulting', 'all'],
		fits_pain_areas: ['marketing-and-lead-response', 'reporting'],
		governance_risk: 'standard',
		notes:
			'Pre-built connectors for Google Ads, Meta, Search Console, and most analytics platforms. Auto-refreshes a single dashboard so monthly client reports take fifteen minutes instead of three hours.'
	},
	{
		id: 'canva-magic-design',
		name: 'Canva Magic Design',
		category: 'design-production',
		hours_saved_per_week_range: [1, 2],
		monthly_cost: 15,
		complexity: 'plug-and-play',
		setup_time_minutes: 15,
		fits_industries: ['marketing-creative', 'real-estate', 'ecommerce', 'all'],
		fits_pain_areas: ['design-production', 'marketing-and-lead-response'],
		governance_risk: 'standard',
		notes:
			'Generates branded social posts, one-pagers, and ad creative from a brief. Brand Kit keeps fonts and colors consistent across the whole team.'
	},
	{
		id: 'gohighlevel',
		name: 'GoHighLevel',
		category: 'crm-and-marketing-automation',
		hours_saved_per_week_range: [3, 6],
		monthly_cost: 97,
		complexity: 'project',
		setup_time_minutes: 480,
		fits_industries: [
			'real-estate',
			'marketing-creative',
			'mortgage-broker',
			'insurance',
			'trades',
			'all'
		],
		fits_pain_areas: ['marketing-and-lead-response', 'crm-hygiene', 'sales-outreach', 'intake'],
		governance_risk: 'standard',
		notes:
			'All-in-one CRM, SMS or email automation, calendar booking, and pipeline. Heaviest setup of the seed library. Worth it for owner-operators with leaky speed-to-lead and no central CRM.'
	},
	{
		id: 'clio-duo',
		name: 'Clio Duo',
		category: 'legal-ai-assistant',
		hours_saved_per_week_range: [2, 4],
		monthly_cost: 59,
		complexity: 'some-setup',
		setup_time_minutes: 90,
		fits_industries: ['legal'],
		fits_pain_areas: ['document-drafting', 'research', 'client-delivery'],
		governance_risk: 'cleared-with-baa',
		notes:
			"Add-on to Clio Manage. Drafts demand letters, summarizes case files, and cites within the firm's matter context. Stays inside Clio's compliance posture, which is the reason it earns the legal slot over generic LLMs."
	},
	{
		id: 'karbon',
		name: 'Karbon',
		category: 'accounting-practice-management',
		hours_saved_per_week_range: [2, 5],
		monthly_cost: 79,
		complexity: 'project',
		setup_time_minutes: 480,
		fits_industries: ['accounting'],
		fits_pain_areas: ['client-delivery', 'intake', 'correspondence', 'bookkeeping-review'],
		governance_risk: 'standard',
		notes:
			'Practice-management workflow with email triage tied to client records. Replaces tag-based Outlook chaos for accounting firms with five to thirty staff.'
	},
	{
		id: 'heidi',
		name: 'Heidi',
		category: 'medical-scribe',
		hours_saved_per_week_range: [5, 10],
		monthly_cost: 35,
		complexity: 'some-setup',
		setup_time_minutes: 60,
		fits_industries: ['medical-or-dental'],
		fits_pain_areas: ['client-delivery', 'document-drafting', 'compliance'],
		governance_risk: 'cleared-with-baa',
		notes:
			'Ambient scribe that drafts SOAP notes during the visit. Offers a HIPAA BAA. Highest hours-returned-per-week tool in the library for medical and dental practices.'
	},
	{
		id: 'motion',
		name: 'Motion',
		category: 'scheduling-and-task',
		hours_saved_per_week_range: [2, 4],
		monthly_cost: 19,
		complexity: 'plug-and-play',
		setup_time_minutes: 30,
		fits_industries: ['all'],
		fits_pain_areas: ['scheduling', 'admin', 'action-item-capture'],
		governance_risk: 'standard',
		notes:
			'AI-driven calendar that auto-blocks tasks around meetings. Replaces manual time blocking for owners who carry the schedule in their head.'
	},
	{
		id: 'rewind',
		name: 'Rewind',
		category: 'session-memory',
		hours_saved_per_week_range: [1, 2],
		monthly_cost: 19,
		complexity: 'plug-and-play',
		setup_time_minutes: 10,
		fits_industries: ['all'],
		fits_pain_areas: ['research', 'action-item-capture'],
		governance_risk: 'standard',
		notes:
			'Searchable local recording of everything seen on screen and heard in calls. Useful for owners who lose context across many short sessions. On-device storage.'
	},
	{
		id: 'superhuman',
		name: 'Superhuman',
		category: 'email-client',
		hours_saved_per_week_range: [2, 4],
		monthly_cost: 30,
		complexity: 'plug-and-play',
		setup_time_minutes: 30,
		fits_industries: ['all'],
		fits_pain_areas: ['email-overload', 'correspondence', 'sales-outreach'],
		governance_risk: 'standard',
		notes:
			'Keyboard-first inbox with AI triage and follow-up nudges. Pricey but typically pays back in two to four hours a week for owners who live in email.'
	},
	{
		id: 'zapier',
		name: 'Zapier',
		category: 'workflow-automation',
		hours_saved_per_week_range: [1, 5],
		monthly_cost: 29,
		complexity: 'some-setup',
		setup_time_minutes: 120,
		fits_industries: ['all'],
		fits_pain_areas: ['admin', 'intake', 'crm-hygiene', 'reporting'],
		governance_risk: 'standard',
		notes:
			'Connects forms, CRMs, calendars, and spreadsheets without code. Best fit when the workflow is already understood and just needs the plumbing automated.'
	},
	{
		id: 'make',
		name: 'Make',
		category: 'workflow-automation',
		hours_saved_per_week_range: [1, 5],
		monthly_cost: 16,
		complexity: 'some-setup',
		setup_time_minutes: 120,
		fits_industries: ['all'],
		fits_pain_areas: ['admin', 'intake', 'crm-hygiene', 'reporting'],
		governance_risk: 'standard',
		notes:
			'Lower-cost Zapier alternative with a visual flow editor. Similar capability, steeper learning curve, much better unit economics at higher volumes.'
	},
	{
		id: 'n8n',
		name: 'n8n',
		category: 'workflow-automation',
		hours_saved_per_week_range: [1, 5],
		monthly_cost: 20,
		complexity: 'project',
		setup_time_minutes: 480,
		fits_industries: ['all'],
		fits_pain_areas: ['admin', 'intake', 'crm-hygiene', 'reporting'],
		governance_risk: 'standard',
		notes:
			'Self-hostable automation platform. Pick this only when the firm has technical staff or wants to keep automation on its own infrastructure for governance reasons.'
	},
	{
		id: 'loom-ai',
		name: 'Loom AI',
		category: 'video-messaging',
		hours_saved_per_week_range: [1, 3],
		monthly_cost: 15,
		complexity: 'plug-and-play',
		setup_time_minutes: 10,
		fits_industries: ['all'],
		fits_pain_areas: ['client-delivery', 'correspondence', 'customer-support'],
		governance_risk: 'standard',
		notes:
			'Quick screen-and-camera videos with AI titles, summaries, and chapters. Replaces a meeting for handoffs that do not need a real-time call.'
	},
	{
		id: 'granola',
		name: 'Granola',
		category: 'meeting-notes',
		hours_saved_per_week_range: [1, 3],
		monthly_cost: 14,
		complexity: 'plug-and-play',
		setup_time_minutes: 10,
		fits_industries: ['all'],
		fits_pain_areas: ['meeting-notes', 'action-item-capture'],
		governance_risk: 'standard',
		notes:
			"Mac-only meeting notes app with templates. Captures action items per meeting type. Good for owners on Mac who prefer a structured note layout over Fathom's recording-first model."
	},
	{
		id: 'clickup-ai',
		name: 'ClickUp AI',
		category: 'project-management',
		hours_saved_per_week_range: [1, 4],
		monthly_cost: 19,
		complexity: 'some-setup',
		setup_time_minutes: 60,
		fits_industries: ['all'],
		fits_pain_areas: ['admin', 'action-item-capture', 'client-delivery', 'scheduling'],
		governance_risk: 'standard',
		notes:
			'Project management with built-in AI for status updates, doc drafting, and meeting summaries. Strong fit when the firm already lives in tasks-and-projects software.'
	},
	{
		id: 'notion-ai',
		name: 'Notion AI',
		category: 'drafting-and-knowledge',
		hours_saved_per_week_range: [1, 3],
		monthly_cost: 18,
		complexity: 'some-setup',
		setup_time_minutes: 30,
		fits_industries: ['all'],
		fits_pain_areas: ['document-drafting', 'research', 'correspondence'],
		governance_risk: 'standard',
		notes:
			'Drafts and summarizes inside Notion docs with the workspace as context. Good for firms that already keep SOPs and meeting notes in Notion.'
	}
];

/**
 * Map quiz industry value (verbatim from QUIZ_INDUSTRIES) to tool-library industry slug.
 * "Other professional services" maps to its own slug; tools tagged 'all' still match.
 */
const INDUSTRY_SLUG_MAP: Record<string, IndustrySlug> = {
	'Accounting or bookkeeping': 'accounting',
	Legal: 'legal',
	'Medical or dental': 'medical-or-dental',
	'Trades or field services': 'trades',
	'Real estate': 'real-estate',
	'Marketing or creative agency': 'marketing-creative',
	Consulting: 'consulting',
	'E-commerce': 'ecommerce',
	'Other professional services': 'other-professional-services',
	'Insurance or brokers': 'insurance',
	'Mortgage broker / lending': 'mortgage-broker'
};

export function industrySlug(industry: string): IndustrySlug {
	return INDUSTRY_SLUG_MAP[industry] ?? 'other-professional-services';
}

export function toolFitsIndustry(tool: ToolEntry, industry: IndustrySlug): boolean {
	return tool.fits_industries.includes(industry) || tool.fits_industries.includes('all');
}

export function toolFitsPainAreas(tool: ToolEntry, painAreas: PainArea[]): boolean {
	return painAreas.some((p) => tool.fits_pain_areas.includes(p));
}

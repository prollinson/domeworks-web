/**
 * Implementation of the `regulated-data-screen` skill (spec at
 * /Users/piers/piers-os/.claude/skills/regulated-data-screen/SKILL.md).
 *
 * Contract: take a prospect's industry + self-reported governance posture,
 * return a deterministic guardrail tier with sector-specific citations.
 *
 * The skill spec is what Claude-in-the-loop reasons about. This module is
 * what runs in the Cloudflare Worker request path.
 *
 * All factual claims resolve to one of the four federal sources in
 * `regulated-data-citations.ts`. If the lookup table is exhausted for a
 * combination the spec doesn't cover, return `guardrail_tier: 'unknown'`
 * rather than substituting.
 */

import type {
	GovernanceComfort,
	GovernanceReview,
	GovernanceRules,
	RegulatedData
} from '$lib/types/quiz';
import { CITATIONS, type Citation, type CitationSource } from '$lib/data/regulated-data-citations';

export type GuardrailTier = 'none' | 'standard' | 'strict' | 'unknown';

export type HumanReviewPolicy = 'mandatory' | 'recommended' | 'optional';

export interface ScreenInput {
	industry: string;
	sensitive_data_flag: RegulatedData;
	governance_rules: GovernanceRules | '';
	governance_review: GovernanceReview | '';
	governance_comfort: GovernanceComfort | '';
}

export interface ScreenOutput {
	guardrail_tier: GuardrailTier;
	required_mitigations: string[];
	sector_citations: Citation[];
	human_review_policy: HumanReviewPolicy;
}

const REGULATED_INDUSTRIES = new Set<string>([
	'Accounting or bookkeeping',
	'Legal',
	'Medical or dental',
	'Mortgage broker / lending',
	'Insurance or brokers'
]);

function citationsForIndustry(industry: string): CitationSource[] {
	switch (industry) {
		case 'Medical or dental':
			return ['HIPAA'];
		case 'Legal':
			return ['ABA-512'];
		case 'Mortgage broker / lending':
		case 'Insurance or brokers':
			return ['FTC-Safeguards'];
		case 'Accounting or bookkeeping':
			return ['FTC-Safeguards', 'AICPA-CIMA'];
		default:
			return [];
	}
}

function decideTier(industry: string, sensitive: RegulatedData): GuardrailTier {
	const isRegulatedIndustry = REGULATED_INDUSTRIES.has(industry);
	if (isRegulatedIndustry && (sensitive === 'yes' || sensitive === 'sometimes')) return 'strict';
	if (isRegulatedIndustry && sensitive === 'no') return 'standard';
	if (!isRegulatedIndustry && sensitive === 'yes') return 'standard';
	if (!isRegulatedIndustry && (sensitive === 'sometimes' || sensitive === 'no')) return 'none';
	return 'unknown';
}

function decideReviewPolicy(
	tier: GuardrailTier,
	rules: GovernanceRules | '',
	review: GovernanceReview | ''
): HumanReviewPolicy {
	if (tier === 'strict') {
		const fullPosture = rules !== 'none' && rules !== '' && review === 'always';
		return fullPosture ? 'recommended' : 'mandatory';
	}
	if (tier === 'standard') return 'recommended';
	if (tier === 'none') return 'optional';
	return 'recommended';
}

function mitigationsFor(
	tier: GuardrailTier,
	industry: string,
	rules: GovernanceRules | '',
	review: GovernanceReview | '',
	comfort: GovernanceComfort | ''
): string[] {
	if (tier === 'unknown') {
		return ['Authority-source unavailable, defer recommendations until citation is re-fetched.'];
	}
	if (tier === 'none') {
		return [
			'No sector-specific guardrails required. Standard vendor due diligence still applies before connecting client systems.'
		];
	}

	const out: string[] = [];

	if (tier === 'strict') {
		if (industry === 'Medical or dental') {
			out.push(
				'Use only AI vendors that sign a HIPAA Business Associate Agreement before any protected health information is processed.'
			);
		}
		if (industry === 'Legal') {
			out.push(
				'Obtain client informed consent before entering matter-specific information into a generative AI tool, per ABA Formal Opinion 512.'
			);
			out.push(
				'Confirm in writing that the tool does not train on client inputs and prevents disclosure to other tenants.'
			);
		}
		if (industry === 'Mortgage broker / lending' || industry === 'Insurance or brokers') {
			out.push(
				'Document AI vendors inside the firm-wide written information security program required by the FTC Safeguards Rule.'
			);
			out.push(
				'Require service providers to contractually maintain safeguards for customer financial information at the same standard as the firm.'
			);
		}
		if (industry === 'Accounting or bookkeeping') {
			out.push(
				'Apply AICPA section 1.700 confidentiality before pasting client books, returns, or correspondence into any third-party AI service.'
			);
			out.push(
				'Document AI vendors inside the firm-wide written information security program required by the FTC Safeguards Rule.'
			);
		}
	}

	if (tier === 'standard') {
		out.push(
			'Treat the AI tool like any other client-facing vendor: review its data handling, retention, and training policies before client work flows through it.'
		);
	}

	if (rules === 'none' || rules === '') {
		out.push(
			'Write down a one-page acceptable-use policy that lists approved AI tools and what data must never go into them.'
		);
	}
	if (review !== 'always') {
		out.push(
			'Require human review of every AI-drafted document or record before it leaves the firm or modifies a client file.'
		);
	}
	if (comfort === 'no' || comfort === 'unsure') {
		out.push(
			'Start with on-device or BAA-covered tools only. Defer general third-party LLMs until the governance posture is documented and signed off.'
		);
	}

	return out;
}

export function screenRegulatedData(input: ScreenInput): ScreenOutput {
	const tier = decideTier(input.industry, input.sensitive_data_flag);

	if (tier === 'unknown') {
		return {
			guardrail_tier: 'unknown',
			required_mitigations: [
				'Authority-source unavailable, defer recommendations until citation is re-fetched.'
			],
			sector_citations: [],
			human_review_policy: 'recommended'
		};
	}

	const sources = citationsForIndustry(input.industry);
	const sector_citations = sources.map((s) => CITATIONS[s]);

	return {
		guardrail_tier: tier,
		required_mitigations: mitigationsFor(
			tier,
			input.industry,
			input.governance_rules,
			input.governance_review,
			input.governance_comfort
		),
		sector_citations,
		human_review_policy: decideReviewPolicy(tier, input.governance_rules, input.governance_review)
	};
}

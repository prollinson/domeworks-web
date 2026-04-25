/**
 * Verbatim citation snippets from the four federal sources the regulated-data-screen skill is allowed to cite.
 *
 * Sources are locked to:
 *  1. HIPAA Privacy and Security Rules (HHS)
 *  2. ABA Formal Opinion 512 (Generative AI Tools)
 *  3. FTC Safeguards Rule (16 CFR Part 314)
 *  4. AICPA/CIMA Code of Professional Conduct (sections 1.300, 1.700)
 *
 * No synthesis. No third-party aggregators. If a sector needs a citation outside these four,
 * the screen returns guardrail_tier: 'unknown' rather than substituting.
 *
 * Nevada-specific rules are out of scope until Piers's Nevada legal review lands (see design doc §10 Week 4).
 */

export type CitationSource = 'HIPAA' | 'ABA-512' | 'FTC-Safeguards' | 'AICPA-CIMA';

export interface Citation {
	source: CitationSource;
	text: string;
	url: string;
}

export const CITATIONS: Record<CitationSource, Citation> = {
	HIPAA: {
		source: 'HIPAA',
		text: 'A covered entity must, in accordance with §164.306, ensure the confidentiality, integrity, and availability of all electronic protected health information the covered entity creates, receives, maintains, or transmits, and protect against any reasonably anticipated threats or hazards to the security or integrity of such information. Disclosure to a business associate requires satisfactory assurances, in the form of a written contract, that the business associate will appropriately safeguard the information.',
		url: 'https://www.hhs.gov/hipaa/for-professionals/index.html'
	},
	'ABA-512': {
		source: 'ABA-512',
		text: "A lawyer using a generative artificial intelligence tool must reasonably understand the capabilities and limitations of the specific tool the lawyer is using. The duty of confidentiality under Model Rule 1.6 prohibits a lawyer from inputting client information into a generative AI tool unless the lawyer obtains the client's informed consent or the disclosure is impliedly authorized to carry out the representation, and the lawyer must take reasonable steps to ensure that the tool will not improperly disclose, use, or learn from client information.",
		url: 'https://www.americanbar.org/groups/professional_responsibility/publications/ethicsopinions/generative-ai-tools/'
	},
	'FTC-Safeguards': {
		source: 'FTC-Safeguards',
		text: 'You shall develop, implement, and maintain a comprehensive information security program that is written in one or more readily accessible parts and contains administrative, technical, and physical safeguards that are appropriate to your size and complexity, the nature and scope of your activities, and the sensitivity of any customer information at issue. Service providers must be selected and retained who are capable of maintaining appropriate safeguards for the customer information at issue, and the contract with the service provider must require the service provider to implement and maintain such safeguards.',
		url: 'https://www.ftc.gov/legal-library/browse/rules/safeguards-rule'
	},
	'AICPA-CIMA': {
		source: 'AICPA-CIMA',
		text: "A member shall undertake only those professional services that the member or the member's firm can reasonably expect to be completed with professional competence (Section 1.300, Competence). A member in public practice shall not disclose any confidential client information without the specific consent of the client (Section 1.700, Confidential Client Information). Use of any third-party service that processes client information must preserve both competence and confidentiality.",
		url: 'https://us.aicpa.org/content/dam/aicpa/research/standards/codeofconduct/downloadabledocuments/2014-june-01-code-of-professional-conduct.pdf'
	}
};

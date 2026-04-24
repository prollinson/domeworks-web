export interface IndustryOption {
	value: string;
	label: string;
}

export const QUIZ_INDUSTRIES: IndustryOption[] = [
	{ value: 'Accounting or bookkeeping', label: 'Accounting or bookkeeping' },
	{ value: 'Legal', label: 'Legal' },
	{ value: 'Medical or dental', label: 'Medical or dental' },
	{
		value: 'Trades or field services',
		label: 'Trades or field services (HVAC, plumbing, landscaping, etc.)'
	},
	{ value: 'Real estate', label: 'Real estate' },
	{ value: 'Marketing or creative agency', label: 'Marketing or creative agency' },
	{ value: 'Consulting', label: 'Consulting' },
	{ value: 'E-commerce', label: 'E-commerce' },
	{ value: 'Other professional services', label: 'Other professional services' },
	{ value: 'Insurance or brokers', label: 'Insurance or brokers' },
	{ value: 'Mortgage broker / lending', label: 'Mortgage broker / lending' }
];

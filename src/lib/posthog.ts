import posthog from 'posthog-js';

export const POSTHOG_KEY = 'phc_cWV8o1edVKhWZpHZiyzEz7oiRDgzNAAQnMEW3M1hayC';
export const POSTHOG_HOST = 'https://app.posthog.com';

if (typeof window !== 'undefined') {
	posthog.init(POSTHOG_KEY, {
		api_host: POSTHOG_HOST,
		capture_pageview: true,
		capture_pageleave: true,
		persistence: 'localStorage'
	});
}

export { posthog };

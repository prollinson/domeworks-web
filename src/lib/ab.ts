import { browser } from '$app/environment'

export type HeroVariant = 'A' | 'B'

const COOKIE_NAME = 'dw_ab_hero'
const COOKIE_DAYS = 30

function setCookie(name: string, value: string, days: number) {
	const expires = new Date(Date.now() + days * 864e5).toUTCString()
	document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
	return match ? match[1] : null
}

export function getHeroVariant(): HeroVariant {
	if (!browser) return 'A'

	const existing = getCookie(COOKIE_NAME)
	if (existing === 'A' || existing === 'B') return existing

	const variant: HeroVariant = Math.random() < 0.5 ? 'A' : 'B'
	setCookie(COOKIE_NAME, variant, COOKIE_DAYS)
	return variant
}

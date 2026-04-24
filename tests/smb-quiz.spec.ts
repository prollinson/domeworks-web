import { test, expect } from '@playwright/test';

test.describe('/smb/quiz — adaptive flow', () => {
	test('completes end-to-end with mocked adaptive endpoint', async ({ page }) => {
		let callCount = 0;

		await page.route('**/api/quiz/next', async (route) => {
			callCount++;
			const responses = [
				{
					id: 'q1',
					question: 'Which practice-management software do you use?',
					helper: null,
					options: ['Karbon', 'Canopy', 'QuickBooks', 'Drake', 'Other'],
					allowOtherText: true,
					infoNeed: 'stack'
				},
				{
					id: 'q2',
					question: 'Roughly how many hours per week on that task?',
					helper: null,
					options: ['Under 1', '1–3', '4–8', '8+', 'Other'],
					allowOtherText: true,
					infoNeed: 'volume'
				},
				{
					id: 'q3',
					question: 'Does the task involve client-sensitive documents?',
					helper: null,
					options: ['Yes', 'No', 'Unsure', 'Other'],
					allowOtherText: true,
					infoNeed: 'sensitive-data'
				}
			];
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(responses[callCount - 1])
			});
		});

		// Mock the submit endpoint so we don't need SEB.
		await page.route('**/api/quiz', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ok: true })
			})
		);

		await page.goto('/smb/quiz/');

		await page.selectOption('#industry', 'Accounting or bookkeeping');
		await page.getByRole('radio', { name: '10–25' }).check({ force: true });
		await page.getByText('Invoicing, scheduling, email triage').click();

		const textarea = page.locator('#dreadedTask');
		await textarea.fill(
			'chasing tax documents from 80 clients every February, roughly 8 hours a week'
		);
		await textarea.blur();

		// Wait for the first adaptive question.
		await expect(page.getByText('Which practice-management software do you use?')).toBeVisible({
			timeout: 4000
		});
		await page.getByRole('radio', { name: 'Karbon' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		await expect(page.getByText('Roughly how many hours per week')).toBeVisible();
		await page.getByRole('radio', { name: '8+' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		await expect(page.getByText('Does the task involve client-sensitive')).toBeVisible();
		await page.getByRole('radio', { name: 'Yes' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		// Email + submit
		await expect(page.locator('#email')).toBeVisible();
		await page.fill('#email', 'cpa@example.com');
		await page.getByRole('button', { name: /Send me my Action Plan/ }).click();

		await expect(page.getByText('Your Action Plan is on the way')).toBeVisible();
		expect(callCount).toBe(3);
	});

	test('falls back to hardcoded questions when the adaptive endpoint fails', async ({ page }) => {
		await page.route('**/api/quiz/next', (route) =>
			route.fulfill({ status: 502, body: 'agent down' })
		);

		await page.goto('/smb/quiz/');
		await page.selectOption('#industry', 'Legal');
		await page.getByRole('radio', { name: '10–25' }).check({ force: true });
		await page.getByText('Invoicing, scheduling, email triage').click();
		const textarea = page.locator('#dreadedTask');
		await textarea.fill(
			'drafting demand letters from scratch every time, 4-5 hours a week typically'
		);
		await textarea.blur();

		// First fallback question is the "stack" question.
		await expect(
			page.getByText("What's the main software that task runs through today?")
		).toBeVisible({ timeout: 4000 });
	});
});

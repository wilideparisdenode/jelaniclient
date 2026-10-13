import { expect, test } from '@playwright/test'

// Public (unauthenticated) journey checks.
test.describe('Public site', () => {
  test('home page shows the Jelani Consulting brand next to the logo', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header.getByText('Jelani Consulting', { exact: true })).toBeVisible()
    await expect(header.getByRole('img', { name: 'Jelani Consulting' })).toBeVisible()
  })

  test('courses page filters no longer include the stray "Whatever" category', async ({ page }) => {
    await page.goto('/courses')
    const filters = page.getByRole('group', { name: 'Filter by category' })
    await expect(filters.getByRole('button', { name: 'All' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Whatever', exact: true })).toHaveCount(0)
  })

  test('back-to-top button appears after scrolling and returns to the top', async ({ page }) => {
    await page.goto('/')
    const backToTop = page.getByRole('button', { name: 'Back to top' })
    await expect(backToTop).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(backToTop).toBeVisible()

    await backToTop.click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(120)
  })

  test('sign-in and register pages render', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
  })
})

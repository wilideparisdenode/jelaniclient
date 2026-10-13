import { expect, test } from '@playwright/test'

// Admin journey checks. Uses the seeded demo admin account (server/scripts/seed.js).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mgm@jelani.consulting'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChandeJac20720'

async function signInAsAdmin(page) {
  await page.goto('/login')
  await page.getByLabel('Email', { exact: true }).fill(ADMIN_EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  // A successful sign-in leaves the /login route.
  await expect(page).not.toHaveURL(/\/login/)
}

test.describe('Admin dashboard', () => {
  test('an admin can sign in and reach the dashboard', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin')
    await expect(page.getByRole('navigation', { name: 'Administration' })).toBeVisible()
    // "Student Roster" was renamed to "Enrollments".
    await expect(page.getByRole('link', { name: 'Enrollments' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Student Roster' })).toHaveCount(0)
  })

  test('course delete asks for confirmation with a styled dialog, not window.confirm', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin/courses')

    let nativeDialogFired = false
    page.on('dialog', (dialog) => { nativeDialogFired = true; dialog.dismiss() })

    const firstDelete = page.getByRole('button', { name: 'Delete' }).first()
    await expect(firstDelete).toBeVisible()
    await firstDelete.click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Delete course' })).toBeVisible()

    // Cancel so no real course is removed during the test run.
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toBeHidden()
    expect(nativeDialogFired).toBe(false)
  })

  test('categories list does not contain the removed "Whatever" entry', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin/categories')
    await expect(page.getByRole('cell', { name: 'Whatever', exact: true })).toHaveCount(0)
  })

  test('an admin can create and then delete a course end to end', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin/courses')

    const title = `E2E Delete Test ${Date.now()}`
    await page.getByLabel('Title', { exact: true }).fill(title)
    await page.getByLabel('Description', { exact: true }).fill('Temporary course created by the automated end-to-end test.')
    await page.getByLabel('Duration', { exact: true }).fill('1 week')
    await page.getByLabel('Level', { exact: true }).fill('Beginner')
    await page.getByLabel(/Tuition/).fill('0')
    await page.getByLabel(/Syllabus/).fill('Lesson one')
    await page.getByRole('button', { name: 'Create course' }).click()

    await expect(page.getByRole('status').filter({ hasText: 'Created successfully.' })).toBeVisible()
    const row = page.getByRole('row', { name: new RegExp(title) })
    await expect(row).toBeVisible()

    await row.getByRole('button', { name: 'Delete' }).click()
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Delete course' }).click()

    await expect(page.getByRole('status').filter({ hasText: 'was deleted.' })).toBeVisible()
    await expect(page.getByRole('cell', { name: title })).toHaveCount(0)
  })

  test('Q&A page explains what the section is for', async ({ page }) => {
    await signInAsAdmin(page)
    await page.goto('/admin/qa')
    await expect(page.getByText(/question-and-answer inbox for enrolled students/i)).toBeVisible()
  })
})

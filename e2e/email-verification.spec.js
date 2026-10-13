import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { expect, test } from '@playwright/test'

// Verifies that an account with an unconfirmed email cannot sign in, and is offered a
// "resend verification" action instead. Requires the server service-role key (read from
// ../server/.env) only to create and delete the throwaway unconfirmed account.

const here = path.dirname(fileURLToPath(import.meta.url))

function readEnv(file) {
  const env = {}
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const index = line.indexOf('=')
    if (index > 0) env[line.slice(0, index).trim()] = line.slice(index + 1).trim()
  }
  return env
}

const serverEnv = readEnv(path.resolve(here, '..', '..', 'server', '.env'))
const supabaseUrl = serverEnv.SUPABASE_URL
const serviceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY

const email = `jelani.e2e.unconfirmed.${Date.now()}@gmail.com`
const password = 'Password123!'
let admin
let userId

test.describe('Email verification gate', () => {
  test.skip(!supabaseUrl || !serviceKey, 'server/.env service-role key not available')

  test.beforeAll(async () => {
    admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: false })
    if (error) throw new Error(`Could not create unconfirmed test user: ${error.message}`)
    userId = data.user.id
  })

  test.afterAll(async () => {
    if (admin && userId) await admin.auth.admin.deleteUser(userId)
  })

  test('an unconfirmed account is blocked from signing in', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Stays on the sign-in page and offers to resend the verification email.
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('button', { name: 'Resend verification email' })).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('JB Tic Tac Toe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads the game and shows initial status', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JB Tic Tac Toe' })).toBeVisible()
    await expect(page.getByText('Next player: X')).toBeVisible()
  })

  test('alternates X and O when squares are clicked', async ({ page }) => {
    const squares = page.locator('.square')

    await squares.nth(0).click()
    await expect(squares.nth(0)).toHaveText('X')
    await expect(page.getByText('Next player: O')).toBeVisible()

    await squares.nth(1).click()
    await expect(squares.nth(1)).toHaveText('O')
    await expect(page.getByText('Next player: X')).toBeVisible()
  })

  test('declares a winner and highlights winning squares', async ({ page }) => {
    const squares = page.locator('.square')

    await squares.nth(0).click()
    await squares.nth(3).click()
    await squares.nth(1).click()
    await squares.nth(4).click()
    await squares.nth(2).click()

    await expect(page.getByText('Winner: X')).toBeVisible()
    await expect(squares.nth(0)).toHaveClass(/square--winning/)
    await expect(squares.nth(1)).toHaveClass(/square--winning/)
    await expect(squares.nth(2)).toHaveClass(/square--winning/)
  })

  test('reset button clears the board and resets status', async ({ page }) => {
    const squares = page.locator('.square')

    await squares.nth(0).click()
    await expect(squares.nth(0)).toHaveText('X')

    await page.getByRole('button', { name: /reset/i }).click()
    await expect(page.getByText('Next player: X')).toBeVisible()
    await expect(squares.nth(0)).toHaveText('')
  })
})

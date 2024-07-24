const {test, expect, describe, beforeEach} = require('@playwright/test')

describe('Blog App', () => {
    test.only('login form is shown', async ({page}) => {
        await page.goto('http://localhost:5173')

        const title = await page.getByText('Log In')
        const usernameInput = await page.getByTestId('usernameInput')
        const passwordInput = await page.getByTestId('passwordInput')

        await expect(title).toBeVisible()
        await expect(usernameInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
    })
})
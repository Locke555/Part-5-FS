const {test, expect, describe, beforeEach} = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
          data: {
            name: 'root',
            username: 'root',
            password: '369943'
          }
        })
    
        await page.goto('http://localhost:5173')
      })


    test('login form is shown', async ({page}) => {

        const title = await page.getByText('Log In')
        const usernameInput = await page.getByTestId('usernameInput')
        const passwordInput = await page.getByTestId('passwordInput')

        await expect(title).toBeVisible()
        await expect(usernameInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
    })

    describe('login',  ()  => {
        test('succeds with correct credentials', async ({page}) => {
            const usernameInput = await page.getByTestId('usernameInput')
            const passwordInput = await page.getByTestId('passwordInput')
            const loginButton = await page.getByRole('button', {name: 'login'})

           await usernameInput.fill('root')
           await passwordInput.fill('369943')
           await loginButton.click()

          const title = await page.getByText('blogs')
          await expect(title).toBeVisible()
        })

        test('fail with incorrect credentials', async ({page}) => {
            const usernameInput = await page.getByTestId('usernameInput')
            const passwordInput = await page.getByTestId('passwordInput')
            const loginButton = await page.getByRole('button', {name: 'login'})

            await usernameInput.fill('root')
            await passwordInput.fill('adasfdafsasf')
            await loginButton.click()

            const title = await page.getByText('Log In')
            await expect(title).toBeVisible()
        })
    })

    describe('when logged in', () => {
      beforeEach(async ({page}) => {
        const usernameInput = await page.getByTestId('usernameInput')
        const passwordInput = await page.getByTestId('passwordInput')
        const loginButton = await page.getByRole('button', {name: 'login'})

        await usernameInput.fill('root')
        await passwordInput.fill('369943')
        await loginButton.click()
      })

      test.only('a new blog can be created', async ({page}) => {
        const titleInput = await page.getByTestId('titleInput')
        const authorInput = await page.getByTestId('authorInput')
        const urlInput = await page.getByTestId('urlInput')
        const submitButton = await page.getByRole('button', {name: 'Submit'})
        const expandButton = await page.getByTestId('expandButton')

        await expandButton.click()
        await titleInput.fill('rust is awesome')
        await authorInput.fill('rustecean')
        await urlInput.fill('www.rust.com')

        const blog = await page.getByText('rust is awesome')
        await expect(blog).toBeDefined()


      })
    })
})
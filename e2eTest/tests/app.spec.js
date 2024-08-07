const {test, expect, describe, beforeEach} = require('@playwright/test')
const { assert } = require('console')

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

      test('a new blog can be created', async ({page}) => {
        const titleInput = await page.getByTestId('titleInput')
        const authorInput = await page.getByTestId('authorInput')
        const urlInput = await page.getByTestId('urlInput')
        const submitButton = await page.getByRole('button', {name: 'Submit'})
        const expandButton = await page.getByTestId('expandButton')

        await expandButton.click()
        await titleInput.fill('rust is awesome')
        await authorInput.fill('rustecean')
        await urlInput.fill('www.rust.com')
        await submitButton.click()

        const blog = await page.getByText('rust is awesome')
        await expect(blog).toBeDefined()


      })

      describe('... and a blog exist', () => {
        beforeEach(async ({page}) => {
        const titleInput = await page.getByTestId('titleInput')
        const authorInput = await page.getByTestId('authorInput')
        const urlInput = await page.getByTestId('urlInput')
        const submitButton = await page.getByRole('button', {name: 'Submit'})
        const expandButton = await page.getByTestId('expandButton')

        await expandButton.click()
        await titleInput.fill('rust is awesome')
        await authorInput.fill('rustecean')
        await urlInput.fill('www.rust.com')
        await submitButton.click()
        })

        test('the blog can be liked', async ({page}) => {
          const expandButon = await page.getByRole('button', {name: 'View'})
          await expandButon.click()

          const likeButton = await page.getByTestId('likeButton')
          await likeButton.click()

          const likes = await page.getByTestId('likes')
          await expect(likes).toContainText('1')
        })
        
        test('The user who created the blog can erase the blog', async ({page}) => {
          page.on('dialog', (dialog) => dialog.accept())

          const expandButon = await page.getByRole('button', {name: 'View'}) 
          await expandButon.click()

          const deleteButton = await page.getByRole('button', {name: 'Delete'})
          await deleteButton.click()

          const blogs = await page.locator("#nonExpandedBlog")

          await expect(blogs).toHaveCount(0)
        })

        describe('... and logged in with another user', () => {
          beforeEach(async ({page, request}) => {
            await request.post('http://localhost:3001/api/users', {
              data: {
                name: 'test',
                username: 'test',
                password: '123456'
              }
            })

            await page.getByRole('button', {name: 'Log Out'}).click()

            const usernameInput = await page.getByTestId('usernameInput')
            const passwordInput = await page.getByTestId('passwordInput')
            const loginButton = await page.getByRole('button', {name: 'login'})

            await usernameInput.fill('test')
            await passwordInput.fill('123456')
            await loginButton.click()
          })

          test.only('The other user cant see the delete button', async ({page}) => {
            await page.getByRole('button', {name: 'View'}).click()

            const results = page.locator('#deleteButton')
            await expect(results).toHaveCount(0)

          })
        })

      })

    })
})
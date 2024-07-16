import { render, screen } from '@testing-library/react'
import { expect, test, describe, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

describe('CreateForm Component Test', () => {
  test.only('Can Add a Blog', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateForm handleCreate={createBlog} />)

    const expandButton = screen.getByTestId('expandButton')
    await user.click(expandButton)

    const titleInput = screen.getByTestId('titleInput')
    const authorInput = screen.getByTestId('authorInput')
    const urlInput = screen.getByTestId('urlInput')
    const submitButton = screen.getByTestId('submitInput')

    await user.type(titleInput, 'Rust is Awesome')
    await user.type(authorInput, 'Rustecean')
    await user.type(urlInput, 'www.rust.com')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: 'Rust is Awesome',
      author: 'Rustecean',
      url: 'www.rust.com',
    })
  })
})

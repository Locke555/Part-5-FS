import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect, test, describe, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

let blog = {
  title: 'Dotnet is awesome',
  author: 'dotnet guy',
  url: 'www.dotnet.com',
  likes: 0,
  user: {
    username: 'user1',
    name: 'user1',
    id: '66732a4de99d6d82360e8ff1',
  },
  id: '66732b03e99d6d82360e900d',
}

describe('Blog Component Tests', () => {
  test('render content, corretly', () => {
    render(
      <Blog blog={blog} setBlogs={null} user={null} setNotification={null} />
    )

    const element = screen.getByText(`${blog.title} ${blog.user.name}`)

    expect(element).toBeDefined()
    expect(element.id).toBe('nonExpandedBlog')
  })

  test.only('The component can expand corretly', async () => {
    const { container } = render(
      <Blog blog={blog} setBlogs={null} user={null} setNotification={null} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    let element = container.querySelector('#expandedBlog')

    expect(element).toBeDefined()
    expect(element.id).toBe('expandedBlog')
  })
})

import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect, test } from 'vitest'

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

test('render content, corretly', () => {
  render(
    <Blog blog={blog} setBlogs={null} user={null} setNotification={null} />
  )

  const element = screen.getByText(`${blog.title} ${blog.user.name}`)

  expect(element).toBeDefined()
  expect(element.id).toBe('nonExpandedBlog')
})

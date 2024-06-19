import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, user, setNotification }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [isExpanded, setExpanded] = useState(false)

  const ToggleExpand = () => {
    setExpanded(!isExpanded)
  }

  const addLike = async () => {
    const newState = {
      ...blog,
      likes: blog.likes + 1,
    }

    const response = await blogService.edit(newState, blog.id)

    console.log(response)

    setBlogs((prev) => {
      return prev
        .map((b) => (b.id === blog.id ? response : b))
        .toSorted((a, b) => b.likes - a.likes)
    })
  }

  const deleteBlog = async () => {
    if (!confirm(`remove blog ${blog.title}`)) {
      return
    }

    if (blog.user.username != user.username) {
      setNotification((prev) => ({
        message: 'Only the creator can erase the blog.',
        isError: true,
      }))
      setTimeout(() => {
        setNotification(null)
      }, 2000)
      return
    }

    await blogService.remove(blog.id)

    setBlogs((prev) => {
      return prev.filter((b) => b.id != blog.id)
    })
  }

  if (isExpanded == false) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.user.name}
        <div>
          <button onClick={ToggleExpand}>View</button>
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} <br /> {blog.user.name} <br /> {blog.likes}
        <button onClick={addLike}>Like</button> <br /> {blog.url}
        <div>
          <button onClick={ToggleExpand}>Close</button>
          <button onClick={deleteBlog}>Delete</button>
        </div>
      </div>
    )
  }
}

export default Blog

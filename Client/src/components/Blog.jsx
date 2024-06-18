import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
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
      return prev.map((b) => (b.id === blog.id ? response : b))
    })
  }

  if (isExpanded == false) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <div>
          <button onClick={ToggleExpand}>View</button>
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} <br /> {blog.author} <br /> {blog.likes}
        <button onClick={addLike}>Like</button> <br /> {blog.url}
        <div>
          <button onClick={ToggleExpand}>Close</button>
        </div>
      </div>
    )
  }
}

export default Blog

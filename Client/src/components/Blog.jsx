import { useState } from 'react'

const Blog = ({ blog }) => {
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
        <button>Like</button> <br /> {blog.url}
        <div>
          <button onClick={ToggleExpand}>Close</button>
        </div>
      </div>
    )
  }
}

export default Blog

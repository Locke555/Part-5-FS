import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import  Login  from './components/Login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const userJson = window.localStorage.getItem('blogAppUser')
    if (userJson) {
      const user = JSON.parse(userJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll()
    .then(blogs =>
      setBlogs( blogs )
    )
    .catch(e => {
      console.log(e.message)
      if (e.response.status === 401) {
        window.localStorage.removeItem('blogAppUser')
        setUser(null)
      }
    })
    
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const user = await loginService.login({username, password})
      blogService.setToken(user.token)
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert("Algo a salido mal.")
    }

  }

  const handleLogOut = () => {
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const newObject = {
        title,
        author,
        url
      }

      const response = await blogService.create(newObject)
      setAuthor('')
      setTitle('')
      setUrl('')
      setBlogs((prev) => prev.concat(response))

    } catch (e) {
      alert("Algo a salido mal al enviar el blog")
      console.log(e.response.status)
    }
  }

  if (user === null) {
    return (
      <Login  handleLogin={handleLogin} 
              username={username} 
              setUsername={setUsername} 
              password={password} 
              setPassword={setPassword}
      />
    )
  }

  return (
    <>
    <div>
      <h2>blogs</h2>
      <div><h2>
        {user.name} is Logged in
        </h2></div>
        <h2>
          Create New Blog
        </h2>
        <div>
          <form onSubmit={handleCreate}>
            <div>
              Title
              <input type="text" 
                     value={title}
                     name="Title"
                     onChange={({target}) => setTitle(target.value)}
              />
            </div>
            <div>
              Author
              <input type="text" 
                     value={author}
                     name="Author"
                     onChange={({target}) => setAuthor(target.value)}              
              />
            </div>
            <div>
              Url
              <input type="text" 
                     value={url}
                     name="Url"
                     onChange={({target}) => setUrl(target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    <div>
      <button
      onClick={handleLogOut}
      >
        Log Out
      </button>
    </div>
    </>
  )
}

  export default App
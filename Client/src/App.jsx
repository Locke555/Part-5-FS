import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const userJson = window.localStorage.getItem('blogAppUser')
    if (userJson) {
      const user = JSON.parse(userJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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

  if (user === null) {
    return (
      <div>
        <h2>Log In</h2>
        <form onSubmit={handleLogin} >
          <div>
            Username 
            <input type="text"
                   value={username}
                   name='Username'
                   onChange={({target}) => setUsername(target.value)}
            />
          </div>
          <div>
            Password 
            <input type="text"
                   value={password}
                   name='Password'
                   onChange={({target}) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <>
    <div>
      <h2>blogs</h2>
      <div><h2>
        {user.name} is Logged in
        </h2></div>
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
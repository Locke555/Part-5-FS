import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import './global.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const formRef = useRef()

  /* Realiza la autenticacion cuando la pagina es abierta */
  useEffect(() => {
    const userJson = window.localStorage.getItem('blogAppUser')
    if (userJson) {
      const user = JSON.parse(userJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  /*Busca los blogs guardados.*/
  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
      .catch((e) => {
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
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification((prev) => ({
        message: 'Wrong Username or Password',
        isError: true,
      }))
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async ({ title, author, url }) => {
    try {
      const newObject = {
        title,
        author,
        url,
      }

      const response = await blogService.create(newObject)
      setBlogs((prev) => prev.concat(response))
      formRef.current.ToggleVisibility()
      setNotification((prev) => ({
        message: 'Blog added succesfully',
        isError: false,
      }))
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch (e) {
      setNotification((prev) => ({
        message: 'Wrong data input',
        isError: true,
      }))
      setTimeout(() => {
        setNotification(null)
      }, 2000)
      console.log(e.response.status)
    }
  }

  if (user === null) {
    return (
      <Login
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        notification={notification}
      />
    )
  }

  return (
    <>
      <div>
        <h2>blogs</h2>
        {notification != null ? (
          <Notification
            message={notification.message}
            isError={notification.isError}
          />
        ) : null}
        <div>
          <h2>{user.name} is Logged in</h2>
        </div>
        <h2>Create New Blog</h2>
        <div>
          <CreateForm handleCreate={handleCreate} ref={formRef} />
        </div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} setBlogs={setBlogs} />
        ))}
      </div>
      <div>
        <button onClick={handleLogOut}>Log Out</button>
      </div>
    </>
  )
}

export default App

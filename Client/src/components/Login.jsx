import Notification from './Notification'

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
  notification,
}) => {
  return (
    <div>
      <h2>Log In</h2>
      {notification != null ? (
        <Notification
          message={notification.message}
          isError={notification.isError}
        />
      ) : null}
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="usernameInput"
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="passwordInput"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login

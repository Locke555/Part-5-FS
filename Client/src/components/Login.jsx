const Login = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (<div>
    <h2>Log In</h2>
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input type="text" value={username} name='Username' onChange={({
          target
        }) => setUsername(target.value)} />
      </div>
      <div>
        Password
        <input type="password" value={password} name='Password' onChange={({
          target
        }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>);
}

export default Login

const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { 'author': 1, 'title': 1, 'url': 1, 'likes': 1 })
  res.status(200).json(users)
})

userRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body
  if (username.length < 3) {
    res.status(400).send({ error: 'You cannot create a user with a length of less than 3 characters.' })
  } else if (password.length < 3) {
    res.status(400).send({ error: 'You cannot create a password with a length of less than 3 characters.' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = userRouter

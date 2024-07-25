const router = require('express').Router()
const Blogs = require('../models/blog')
const Users = require('../models/user')

router.post('/reset', async (req, res) => {
  await Blogs.deleteMany({})
  await Users.deleteMany({})

  res.status(204).end()

})

module.exports = router
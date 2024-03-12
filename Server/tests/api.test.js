const { test, after, before, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialState = [
  {
    title: 'Exploring Mongoose Schemas',
    author: 'John Doe',
    url: 'www.example.com',
    likes: 25
  },
  {
    title: 'Mastering Validation in Mongoose',
    author: 'Jane Smith',
    url: 'www.tutorialspoint.com',
    likes: 18
  },
  {
    title: 'Building Efficient Data Models with Mongoose',
    author: 'David Johnson',
    url: 'www.mongodb.com',
    likes: 31
  },
  {
    title: 'Querying Data Effectively in Mongoose',
    author: 'Emily Williams',
    url: 'www.mongoosejs.com',
    likes: 42
  },
  {
    title: 'Optimizing Performance with Mongoose',
    author: 'Robert Jackson',
    url: 'www.codementor.io',
    likes: 15
  },
  {
    title: 'Handling Relationships in Mongoose',
    author: 'Michelle Lee',
    url: 'www.sitepoint.com',
    likes: 29
  },
  {
    title: 'Best Practices for Using Mongoose in Production',
    author: 'Ryan Miller',
    url: 'www.nodejs.org',
    likes: 38
  },
  {
    title: 'Troubleshooting Common Mongoose Issues',
    author: 'Sarah Thompson',
    url: 'www.stackoverflow.com',
    likes: 12
  },
  {
    title: 'Advanced Techniques for Mongoose Developers',
    author: 'Michael Brown',
    url: 'www.medium.com',
    likes: 50
  },
  {
    title: 'Building Scalable Applications with Mongoose',
    author: 'Laura White',
    url: 'www.digitalocean.com',
    likes: 21
  }
]

before(async () => {
  const testUser = {
    username: 'root',
    name: 'root',
    passwordHash: await bcrypt.hash('12356789', 10)
  }
  const user = new User(testUser)
  await user.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const user = await User.findOne({ username: 'root' })

  await Blog.insertMany(initialState.map((actual) => ({
    ...actual,
    user: user._id
  })))
})

test('all notes are returned as JSON', async () => {
  const token = await getTestToken()

  const response = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 10)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const token = await getTestToken()
  const response = await api.get('/api/blogs')
    .set('Authorization', token)

  assert(Object.hasOwn(response.body[0], 'id'))
})

test('Making a HTTP POST Request, succesfully creates a new blog post', async () => {
  const newBlogPost = {
    title: 'Rust is Awesome',
    author: 'Rustecean',
    url: 'www.rustlang.org',
    likes: 200
  }
  const token = await getTestToken()
  const response = await api.post('/api/blogs')
    .send(newBlogPost)
    .set('Authorization', token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const allData = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)

  delete response.body.id

  const user = await User.findOne({ username: 'root' })

  assert.strictEqual(allData.body.length, initialState.length + 1)
  assert.deepStrictEqual(response.body, { ...newBlogPost, user: user._id.toString() })

})

test('if likes property is missing, it will be default to 0', async () => {
  const newBlogPost = {
    title: 'Rust is Awesome',
    author: 'Rustecean',
    url: 'www.rustlang.org',
  }

  const token = await getTestToken()

  const response = await api.post('/api/blogs')
    .send(newBlogPost)
    .set('Authorization', token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('if the title or url properties are missing, responds to the request with the status code 400', async () => {
  let newBlogPost = {
    author: 'Rustecean',
    likes: 200
  }

  const token = await getTestToken()

  await api.post('/api/blogs')
    .send(newBlogPost)
    .set('Authorization', token)
    .expect(400)
})

test('delete succesfully a single blog', async () => {
  const token = await getTestToken()
  let allNotes = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)

  let singleNoteId = allNotes.body[0].id

  await api.delete(`/api/blogs/${singleNoteId}`)
    .set('Authorization', token)
    .expect(204)

  let allNotesBeforeDelete = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)

  assert.strictEqual(allNotesBeforeDelete.body.length, allNotes.body.length - 1)
})

test('update succesfully a single blog', async () => {
  const token = await getTestToken()
  let allNotes = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)

  let singleNoteId = allNotes.body[0].id

  let newNote = {
    title: 'Exploring Mongoose Schemas',
    author: 'John Doe',
    url: 'www.example.com',
    likes: 100
  }

  let putResponse = await api.put(`/api/blogs/${singleNoteId}`)
    .send(newNote)
    .set('Authorization', token)
    .expect(200)

  let newState = await api.get('/api/blogs')
    .set('Authorization', token)
    .expect(200)

  delete putResponse.body.user
  delete newState.body[0].user

  assert.strictEqual(putResponse.body.id, singleNoteId)
  assert.deepStrictEqual(putResponse.body, newState.body[0])
})

test.only('Creating a user without a token return 401', async () => {
  const newBlogPost = {
    title: 'Rust is Awesome',
    author: 'Rustecean',
    url: 'www.rustlang.org',
    likes: 200
  }

  await api.post('/api/blogs')
    .send(newBlogPost)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

describe('Users Test', () => {
  test('create succesfully a single user', async () => {
    let newUser = {
      username: 'foooo',
      name: 'foo bar',
      password: '12345'
    }

    let response = await api.post('/api/users')
      .send(newUser)
    //.expect(201)
    console.log(response.body)
    assert(Object.hasOwn(response.body, 'id'))
  })

  test('cant create a user with a password or username shorter than 3 character', async () => {
    let badPassword = {
      username: 'foooo',
      name: 'foo bar',
      password: '12'
    }

    let badUsername = {
      username: 'fo',
      name: 'foo bar',
      password: '12456789'
    }

    let badPasswordResponse = await api.post('/api/users')
      .send(badPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(badPasswordResponse.body.error, 'You cannot create a password with a length of less than 3 characters.')

    let badUsernameResponse = await api.post('/api/users')
      .send(badUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(badUsernameResponse.body.error, 'You cannot create a user with a length of less than 3 characters.')
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

const getTestToken = async () => {
  let user = await User.findOne({ username: 'root' })

  let unsignedToken = {
    username: 'root',
    id: user._id
  }

  let token = jwt.sign(unsignedToken, process.env.SECRET, { expiresIn: 60 * 60 })

  return `Bearer ${token}`
}
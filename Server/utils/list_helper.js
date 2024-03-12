const fp = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (acc, curr) => curr.likes + acc, 0
  )
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(
    (acc, curr) => {
      if (acc !== null) {
        return acc.likes > curr.likes ? acc : curr
      } else {
        return curr
      }
    }, null
  )

  if (favorite === null) {
    return null
  }

  const result = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }

  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const map = fp.countBy(blogs, 'author')

  const authorMoreBlogs = Object.keys(map).reduce(
    (acc, curr) => map[curr] >= map[acc] ? curr : acc,
    Object.keys(map)[0]
  )

  return {
    author: authorMoreBlogs,
    blogs: map[authorMoreBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce(
    (acc, curr) => {
      if (acc !== null) {
        return acc.likes > curr.likes ? acc : curr
      } else {
        return curr
      }
    }, null
  )

  return {
    author: favorite.author,
    likes: favorite.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes

}
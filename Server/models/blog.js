const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String, required: true, minLength: 5
  },
  author: {
    type: String, required: true, minLength: 5
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /^w{3}\.\w+\.[a-z]{2,3}/.test(v)
      },
      message: props => `${props.value} is not a valid url!`
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
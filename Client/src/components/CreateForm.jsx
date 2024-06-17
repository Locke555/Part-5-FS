import React, { useState, forwardRef, useImperativeHandle } from 'react'

const CreateForm = forwardRef(({ handleCreate }, refs) => {
  const [isVisible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const showWhenVisible = { display: isVisible ? '' : 'none' }
  const hideWhenVisible = { display: isVisible ? 'none' : '' }

  const ToggleVisibility = () => {
    setVisible(!isVisible)
  }

  useImperativeHandle(refs, () => {
    return {
      ToggleVisibility,
    }
  })

  const newNote = (e) => {
    e.preventDefault()

    handleCreate({ title, author, url })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={ToggleVisibility}>Create Note</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={newNote}>
          <div>
            Title
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            Author
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            Url
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <button onClick={ToggleVisibility}>Cancel</button>
      </div>
    </>
  )
})

export default CreateForm

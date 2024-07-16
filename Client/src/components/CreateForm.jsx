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
        <button onClick={ToggleVisibility} data-testid="expandButton">
          Create Note
        </button>
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
              data-testid="titleInput"
            />
          </div>
          <div>
            Author
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
              data-testid="authorInput"
            />
          </div>
          <div>
            Url
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
              data-testid="urlInput"
            />
          </div>
          <button type="submit" data-testid="submitInput">
            Submit
          </button>
        </form>
        <button onClick={ToggleVisibility}>Cancel</button>
      </div>
    </>
  )
})

export default CreateForm

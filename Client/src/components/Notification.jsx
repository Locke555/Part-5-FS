import React from 'react'

const Notification = ({ message, isError }) => {
  if (message == '') {
    return null
  } else if (!isError) {
    return <div className="notification">{message}</div>
  } else if (isError) {
    return <div className="error">{message}</div>
  }
}

export default Notification

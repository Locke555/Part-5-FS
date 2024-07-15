import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  if (message == '') {
    return null
  } else if (!isError) {
    return <div className="notification">{message}</div>
  } else if (isError) {
    return <div className="error">{message}</div>
  }
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
}

export default Notification

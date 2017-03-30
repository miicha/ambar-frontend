import React, { Component } from 'react'
import { FullScreenLoader, NotificationIndicator } from 'components/BasicComponents'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'

class CoreLayout extends Component {
  componentDidMount() {
    const { loadConfig } = this.props
    loadConfig()
  }

  render() {
    const {
      children,
      fetching,
      isError,
      errorMessage,
      setAppTitle,
      isNotificationOpen,
      notificationMessage,
      notificationReason,
      closeNotification } = this.props

    return (
      <div>
        {fetching && <FullScreenLoader />}
        {!fetching && React.cloneElement(this.props.children, { setAppTitle: setAppTitle })}
        <NotificationIndicator
          isOpen={isNotificationOpen}
          message={!notificationMessage ? '' : notificationMessage}
          reason={notificationReason}
          close={() => closeNotification()}
        />
      </div>)
  }
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  loadConfig: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool.isRequired,
  isNotificationOpen: React.PropTypes.bool.isRequired,
  notificationMessage: React.PropTypes.string,
  notificationReason: React.PropTypes.string,
  closeNotification: React.PropTypes.func.isRequired
}

export default CoreLayout

import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import Sources from './components/Sources'
import classes from './RefineSearchModal.scss'

export const RefineSearchModal = ({isRefineSearchModalOpen, toggleRefineSearchModal, sources, toggleSourceSelected}) => {
  const actions = [
    <FlatButton
      label="OK"
      primary={true}
      keyboardFocused={true}
      onTouchTap={() => toggleRefineSearchModal()}
      />
  ]

  return (
    <Dialog
      contentStyle={{ maxWidth: '500px' }}
      title='Select sources to include in search'
      modal={false}
      actions={actions}
      open={isRefineSearchModalOpen}
      onRequestClose={() => toggleRefineSearchModal()}
      bodyStyle={{ padding: '0' }}
      autoScrollBodyContent={true}
      >      
      <Sources sources={sources} toggleSourceSelected={toggleSourceSelected} />
    </Dialog>)
}


RefineSearchModal.propTypes = {
  isRefineSearchModalOpen: React.PropTypes.bool.isRequired,
  toggleRefineSearchModal: React.PropTypes.func.isRequired,
  sources: React.PropTypes.object.isRequired,
  toggleSourceSelected: React.PropTypes.func.isRequired
}

export default RefineSearchModal

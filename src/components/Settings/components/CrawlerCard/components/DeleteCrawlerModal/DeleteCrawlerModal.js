import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

const DeleteCrawlerModal = (props) => {
    const { crawler, crawler: { meta, displayArgs }, setDeleteModalOpen, deleteCrawler, localization } = props
    const deleteDialogActions = [
        <FlatButton
            label={localization.settingsPage.cancelLabel}
            disabled={meta.fetching}
            onTouchTap={() => setDeleteModalOpen(crawler, false)}
        />,
        <FlatButton
            label={localization.settingsPage.deleteLabel}
            secondary={true}
            disabled={meta.fetching}
            onTouchTap={() => deleteCrawler(crawler)}
        />
    ]

    return (<Dialog
        title={localization.settingsPage.deleteCrawlerModalTitleLabel}
        actions={deleteDialogActions}
        modal={true}
        open={displayArgs.isDeleteModalOpen}
    >
        {localization.settingsPage.deleteCrawlerWarningLabel}
    </Dialog>)
}

DeleteCrawlerModal.propTypes = {
    crawler: React.PropTypes.object.isRequired,
    deleteCrawler: React.PropTypes.func.isRequired,
    setDeleteModalOpen: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default DeleteCrawlerModal
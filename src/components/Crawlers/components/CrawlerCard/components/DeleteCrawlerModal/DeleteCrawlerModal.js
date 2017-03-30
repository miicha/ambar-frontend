import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

const DeleteCrawlerModal = (props) => {
    const {crawler, crawler: {meta, displayArgs}, setDeleteModalOpen, deleteCrawler} = props
    const deleteDialogActions = [
        <FlatButton
            label="Cancel"
            disabled={meta.fetching}
            onTouchTap={() => setDeleteModalOpen(crawler, false)}
            />,
        <FlatButton
            label="Delete"
            secondary={true}
            disabled={meta.fetching}
            onTouchTap={() => deleteCrawler(crawler)}
            />
    ]

    return (<Dialog
        title="Delete Crawler"
        actions={deleteDialogActions}
        modal={true}
        open={displayArgs.isDeleteModalOpen}
        >
        Are you sure you want to delete this crawler?
        </Dialog>)
}

DeleteCrawlerModal.propTypes = {
    crawler: React.PropTypes.object.isRequired,
    deleteCrawler: React.PropTypes.func.isRequired,
    setDeleteModalOpen: React.PropTypes.func.isRequired
}

export default DeleteCrawlerModal
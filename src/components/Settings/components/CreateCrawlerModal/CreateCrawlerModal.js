import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import CreateCrawlerFrame from './components/CreateCrawlerFrame'

const CreateCrawlerModal = (props) => {
    const { newCrawler, setNewCrawlerJSON, setCreateCrawlerModalOpen, createNewCrawler, localization } = props

    const createCrawlerModalActions = [
        <FlatButton
            label={localization.settingsPage.cancelLabel}
            disabled={newCrawler.fetching}
            onTouchTap={() => setCreateCrawlerModalOpen(newCrawler, false)}
        />,
        <FlatButton
            label={localization.settingsPage.createLabel}
            secondary={true}
            disabled={newCrawler.fetching}
            onTouchTap={() => createNewCrawler(newCrawler)}
        />
    ]

    return (
        <Dialog
            title={localization.settingsPage.createCrawlerModalTitleLabel}
            actions={createCrawlerModalActions}
            modal={true}
            open={newCrawler.isCreateCrawlerModalOpen}
            contentStyle={{
                width: '80%',
                maxWidth: 'none',
            }}
        >
            <CreateCrawlerFrame newCrawler={newCrawler} setNewCrawlerJSON={setNewCrawlerJSON} />
        </Dialog>)
}

CreateCrawlerModal.propTypes = {
    newCrawler: React.PropTypes.object.isRequired,
    setNewCrawlerJSON: React.PropTypes.func.isRequired,
    setCreateCrawlerModalOpen: React.PropTypes.func.isRequired,
    createNewCrawler: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default CreateCrawlerModal
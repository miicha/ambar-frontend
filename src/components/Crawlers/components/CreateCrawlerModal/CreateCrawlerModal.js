import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import CreateCrawlerFrame from './components/CreateCrawlerFrame'

const CreateCrawlerModal = (props) => {
    const {newCrawler, setNewCrawlerJSON, setCreateCrawlerModalOpen, createNewCrawler} = props

    const createCrawlerModalActions = [
        <FlatButton
            label="Cancel"
            disabled={newCrawler.fetching}
            onTouchTap={() => setCreateCrawlerModalOpen(newCrawler, false)}
            />,
        <FlatButton
            label="Create"
            secondary={true}
            disabled={newCrawler.fetching}
            onTouchTap={() => createNewCrawler(newCrawler)}
            />
    ]

    return (
        <Dialog
            title="Create Crawler"
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
    createNewCrawler: React.PropTypes.func.isRequired
}

export default CreateCrawlerModal
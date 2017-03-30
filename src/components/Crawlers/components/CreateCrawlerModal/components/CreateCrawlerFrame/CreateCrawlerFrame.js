import React, { Component } from 'react'
import { CodeEditor } from 'components/BasicComponents'
import Snackbar from 'material-ui/Snackbar'
import classes from './CreateCrawlerFrame.scss'

const CreateCrawlerFrame = (props) => {
    const { setNewCrawlerJSON, newCrawler } = props
    return (
        <div style={{ marginLeft: '-24px', marginRight: '-24px', marginBottom: '-24px' }}>
            <CodeEditor
                uId={'newCrawlerCodeEditor'}
                value={newCrawler.json}
                onChange={(json) => setNewCrawlerJSON(newCrawler, json)}
                readOnly={newCrawler.fetching}
                systemMessage={newCrawler.jsonTouched ? '' : newCrawler.errorMessage}
                />
        </div>
    )
}

CreateCrawlerFrame.propTypes = {
    setNewCrawlerJSON: React.PropTypes.func.isRequired,
    newCrawler: React.PropTypes.object.isRequired,
}

export default CreateCrawlerFrame

import React from 'react'
import { CodeEditor } from 'components/BasicComponents'
import Snackbar from 'material-ui/Snackbar'
import Divider from 'material-ui/Divider'
import classes from './CrawlerDescriptionJSONEditor.scss'

const crawlerJsonChanged = (setCrawlerUpdateJSON, crawler, jsonString) => {
    setCrawlerUpdateJSON(crawler, jsonString)
}

const CrawlerDescriptionJSONEditor = (props) => {
    const { crawler, crawler: {settings: settings, meta: meta}, setCrawlerUpdateJSON, updateCrawlerFromUpdateJSON } = props
    return (
        <div style={{ marginLeft: '-24px', marginRight: '-24px', marginBottom: '-24px' }}>
            <CodeEditor
                uId={settings.id}
                value={meta.updateJSON}
                onChange={(jsonString) => crawlerJsonChanged(setCrawlerUpdateJSON, crawler, jsonString)}
                readOnly={meta.fetching}
                systemMessage={meta.updateJSONTouched ? '' : meta.errorMessage}
                />                      
        </div>
    )
}

CrawlerDescriptionJSONEditor.propTypes = {
    crawler: React.PropTypes.object.isRequired,
    setCrawlerUpdateJSON: React.PropTypes.func.isRequired,
    updateCrawlerFromUpdateJSON: React.PropTypes.func.isRequired
}

export default CrawlerDescriptionJSONEditor
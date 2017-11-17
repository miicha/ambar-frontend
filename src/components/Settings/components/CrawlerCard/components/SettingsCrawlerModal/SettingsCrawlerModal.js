import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import CrawlerDescriptionJSONEditor from './components/CrawlerDescriptionJSONEditor'

const SettingsCrawlerModal = (props) => {
    const { crawler, crawler: { meta, displayArgs }, setSettingsModalOpen, setCrawlerUpdateJSON, updateCrawlerFromUpdateJSON, localization } = props
    const settingsDialogActions = [
        <FlatButton
            label={localization.settingsPage.cancelLabel}
            disabled={meta.fetching}
            onTouchTap={() => setSettingsModalOpen(crawler, false)}
        />,
        <FlatButton
            label={localization.settingsPage.saveLabel}
            secondary={true}
            disabled={meta.fetching}
            onTouchTap={() => updateCrawlerFromUpdateJSON(crawler)}
        />
    ]

    return (
        <Dialog
            title={localization.settingsPage.editCrawlerModalTitleLabel}
            actions={settingsDialogActions}
            modal={true}
            open={displayArgs.isSettingsModalOpen}
            contentStyle={{
                width: '80%',
                maxWidth: 'none',
            }}>
            <CrawlerDescriptionJSONEditor
                crawler={crawler}
                setCrawlerUpdateJSON={setCrawlerUpdateJSON}
                updateCrawlerFromUpdateJSON={updateCrawlerFromUpdateJSON}
            />
        </Dialog>
    )

}

SettingsCrawlerModal.propTypes = {
    crawler: React.PropTypes.object.isRequired,
    setSettingsModalOpen: React.PropTypes.func.isRequired,
    setCrawlerUpdateJSON: React.PropTypes.func.isRequired,
    updateCrawlerFromUpdateJSON: React.PropTypes.func.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default SettingsCrawlerModal
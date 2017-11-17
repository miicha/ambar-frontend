import React, { Component } from 'react'

import ClearIcon from 'material-ui/svg-icons/content/clear'
import StartIcon from 'material-ui/svg-icons/av/play-arrow'
import StopIcon from 'material-ui/svg-icons/av/stop'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import Paper from 'material-ui/Paper'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import LogView from '../LogView'
import DeleteCrawlerModal from './components/DeleteCrawlerModal'
import SettingsCrawlerModal from './components/SettingsCrawlerModal'

import classes from './CrawlerCard.scss'
import formClasses from '../../Settings.scss'

class CrawlerCard extends Component {
    componentDidMount() {
        const { crawler, refreshCrawler } = this.props
        this.updateDescriptor = setInterval(() => refreshCrawler(crawler.settings.id), 3 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.updateDescriptor)
    }

    render() {
        const {
            crawler,
            crawler: { settings, meta, log, displayArgs },
            startStopCrawler,
            setCrawlerUpdateJSON,
            updateCrawlerFromUpdateJSON,
            setDeleteModalOpen,
            setSettingsModalOpen,
            deleteCrawler,
            localization
        } = this.props

        const buttonCommand = meta.state === 'running' ? 'stop' : 'start'

        const getStateColor = (state) => {
            const green500 = '#4CAF50'
            const orange500 = '#FF9800'
            const deepOrange500 = '#FF5722'
            const lightBlue500 = '#03A9F4'

            switch (state) {
                case 'idle':
                    return orange500
                case 'running':
                    return green500
                default:
                    return deepOrange500
            }
        }

        const getStateDescription = (state, localization) => {
            switch (state) {
                case 'idle':
                    return localization.settingsPage.crawlerIdleStateLabel
                case 'running':
                    return localization.settingsPage.crawlerRunningStateLabel
                default:
                    return localization.settingsPage.crawlerUndefinedStateLabel
            }
        }

        return (
            <Paper zDepth={1} className={formClasses.settingsCard}>
                <Card>
                    <CardTitle
                        title={
                            <div className={classes.cardTitleContainer}>
                                <div>{settings.id}</div>
                                <RaisedButton
                                    label={getStateDescription(meta.state, localization)}
                                    labelStyle={{ color: 'white', top: '-2px' }}
                                    backgroundColor={getStateColor(meta.state)}
                                />
                            </div>
                        }
                        subtitle={<span><span style={{ textTransform: 'uppercase' }}>{settings.type}</span> {localization.settingsPage.crawlerLabel} ({settings.description})</span>} />
                    <CardText>
                        <LogView log={log} />
                    </CardText>
                    <CardActions className={classes.cardActionsContainer}>
                        <div>
                            <FlatButton
                                icon={meta.state === 'running' ? <StopIcon /> : <StartIcon />}
                                label={meta.state === 'running' ? localization.settingsPage.crawlerStopLabel : localization.settingsPage.crawlerEnqueueLabel}
                                primary={true}
                                onTouchTap={() => startStopCrawler(crawler, buttonCommand)}
                            />
                            <FlatButton
                                icon={<SettingsIcon />}
                                label={localization.settingsPage.crawlerSettingsLabel}
                                primary={true}
                                onTouchTap={() => setSettingsModalOpen(crawler, true)}
                            />
                            <SettingsCrawlerModal
                                crawler={crawler}
                                setSettingsModalOpen={setSettingsModalOpen}
                                updateCrawlerFromUpdateJSON={updateCrawlerFromUpdateJSON}
                                setCrawlerUpdateJSON={setCrawlerUpdateJSON}
                                localization={localization}
                            />
                        </div>
                        <FlatButton
                            icon={<DeleteIcon />}
                            label={localization.settingsPage.deleteLabel}
                            secondary={true}
                            onTouchTap={() => setDeleteModalOpen(crawler, true)}
                        />
                        <DeleteCrawlerModal
                            crawler={crawler}
                            setDeleteModalOpen={setDeleteModalOpen}
                            deleteCrawler={deleteCrawler}
                            localization={localization}
                        />
                    </CardActions>
                </Card>
            </Paper>
        )
    }
}

CrawlerCard.propTypes = {
    crawler: React.PropTypes.object.isRequired,
    startStopCrawler: React.PropTypes.func.isRequired,
    deleteCrawler: React.PropTypes.func.isRequired,
    setCrawlerUpdateJSON: React.PropTypes.func.isRequired,
    updateCrawlerFromUpdateJSON: React.PropTypes.func.isRequired,
    refreshCrawler: React.PropTypes.func.isRequired,
    setDeleteModalOpen: React.PropTypes.func.isRequired,
    setSettingsModalOpen: React.PropTypes.func.isRequired
}

export default CrawlerCard

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
import formClasses from '../../Crawlers.scss'

class CrawlerCard extends Component {
    componentDidMount() {
        const {crawler, refreshCrawler} = this.props
        this.updateDescriptor = setInterval(() => refreshCrawler(crawler.settings.id), 3 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.updateDescriptor)
    }

    render() {
        const {
            crawler,
            crawler: {settings, meta, log, displayArgs},
            startStopCrawler,
            setCrawlerUpdateJSON,
            updateCrawlerFromUpdateJSON,
            setDeleteModalOpen,
            setSettingsModalOpen,
            deleteCrawler} = this.props
        const buttonCommand = meta.state === 'running' ? 'stop' : 'start'

        const getStateColor = (state) => {
            const green500 = '#4CAF50'
            const orange500 = '#FF9800'
            const deepOrange500 = '#FF5722'
            const lightBlue500 = '#03A9F4'

            switch (state) {
                case 'undefined':
                    return deepOrange500
                case 'idle':
                    return orange500
                case 'running':
                    return green500
                default:
                    return deepOrange500
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
                                    label={meta.state}
                                    labelStyle={{color: 'white', top: '-2px'}}
                                    backgroundColor={getStateColor(meta.state)}
                                    />
                            </div>
                        }
                        subtitle={<span><span style={{ textTransform: 'uppercase' }}>{settings.type}</span> Crawler ({settings.description})</span>} />
                    <CardText>
                        <LogView log={log} />
                    </CardText>
                    <CardActions className={classes.cardActionsContainer}>
                        <div>
                            <FlatButton
                                icon={meta.state === 'running' ? <StopIcon /> : <StartIcon />}
                                label={meta.state === 'running' ? 'Stop' : 'Enqueue'}
                                primary={true}
                                onTouchTap={() => startStopCrawler(crawler, buttonCommand)} />
                            <FlatButton icon={<SettingsIcon />} label="Settings" primary={true} onTouchTap={() => setSettingsModalOpen(crawler, true)} />
                            <SettingsCrawlerModal 
                                crawler={crawler} 
                                setSettingsModalOpen={setSettingsModalOpen} 
                                updateCrawlerFromUpdateJSON={updateCrawlerFromUpdateJSON} 
                                setCrawlerUpdateJSON={setCrawlerUpdateJSON}
                            />
                        </div>
                        <FlatButton icon={<DeleteIcon />} label="Delete" secondary={true} onTouchTap={() => setDeleteModalOpen(crawler, true)} />
                        <DeleteCrawlerModal crawler={crawler} setDeleteModalOpen={setDeleteModalOpen} deleteCrawler={deleteCrawler} />
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

import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip'
import { LoadingIndicator } from 'components/BasicComponents'
import MediaQuery from 'react-responsive'

import classes from './DropboxCard.scss'

const FetchingCardContent = () => (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator large />
    </div>)

const DisconnectedCardContent = () => (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
        <MediaQuery query='(min-width: 512px)'>
            <img height='100%' width='100%' src='dropbox.svg' alt='dropbox' />
        </MediaQuery>
        <div style={{ display: 'flex', minWidth: '150px'}}>
            <p>Supercharge Ambar with files from your Dropbox.
                Ambar doesn't share or send your files to any third parties. All the files are only yours.
                After connected Ambar scans your Dropbox for new files every 15 minutes.
                <br/><br/>
                Please, do not expect your files to appear immediately, Ambar needs some time to process them.
            </p>
        </div>
    </div>)

const FolderChip = (props) => (
    <Chip 
        style={{ margin: '1px', display: 'inline-block' }} 
        labelStyle={{ 
            maxWidth: '200px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: '12px',
            paddingLeft: '7px',
            paddingRight: '7px',
            lineHeight: '25px' }}>
        {props.children}
    </Chip>)

const ConnectedCardContent = ({ dropboxCrawler }) => {

    const MAX_FODLERS_COUNT = 20

    const lastActivityDate = dropboxCrawler.last_run_time_diff ? `${dropboxCrawler.last_run_time_diff} ago` : 'in process'

    const folders = dropboxCrawler.locations.length > MAX_FODLERS_COUNT
        ? dropboxCrawler.locations.slice(0, MAX_FODLERS_COUNT)
        : dropboxCrawler.locations

    const foldersView = folders.map((location, idx) =>
        <FolderChip key={idx}>
            {location.location.slice(1).capitalize()}
        </FolderChip>)

    return (
        <div className={classes.userInfo} style={{ display: 'flex', flexDirection: 'column' }}>
            <p><b>Current State:</b> {dropboxCrawler.state === 'running' ? 'running' : 'idle'}</p>
            <p><b>Updated:</b> {lastActivityDate}</p>
            <p><b>Update Interval:</b> every 15 minutes</p>
            <p><b>Connected Folders:</b> {foldersView} {folders.length < dropboxCrawler.locations.length && <FolderChip>... and {dropboxCrawler.locations.length - folders.length} more</FolderChip>}
            </p>
        </div>)
}
const DropboxCard = (props) => {
    const { fetching, dropboxCrawler, initDropboxCrawler, deleteDropboxCrawler } = props

    const isConnected = dropboxCrawler ? true : false

    return (
        <Paper zDepth={1} className={classes.accountCard}>
            <Card>
                <CardTitle title='Dropbox' />
                <CardText style={{ paddingTop: '0', height: '170px' }}>
                    {fetching && <FetchingCardContent />}
                    {!fetching && (isConnected ? <ConnectedCardContent dropboxCrawler={dropboxCrawler} /> : <DisconnectedCardContent />)}
                </CardText>
                <CardActions>
                    <RaisedButton
                        label={isConnected ? "Disconnect" : "Connect"}
                        disabled={fetching}
                        secondary={!isConnected}
                        primary={isConnected}
                        onTouchTap={() => isConnected ? deleteDropboxCrawler() : initDropboxCrawler()} />
                </CardActions>
            </Card>
        </Paper>)
}

DropboxCard.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    dropboxCrawler: React.PropTypes.object,
    initDropboxCrawler: React.PropTypes.func.isRequired,
    deleteDropboxCrawler: React.PropTypes.func.isRequired
}

export default DropboxCard
import React from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import classes from './DemoModeCard.scss'

export const DemoModeCard = (props) =>
    <Paper zDepth={1} className={classes.demoModeCard}>
        <Card>
            <CardTitle title={'It\'s just a demo...'} />
            <CardText style={{display: 'flex', justifyContent: 'center'}}>
                <img style={{maxHeight: '150px'}} src='/animated-owl.gif' alt='Demo...'/>
            </CardText>
            <CardText>
                This page is unavailiable in demo mode.
                You can download a free version of Ambar on <a href='http://ambar.rdseventeen.com/' target='_blank' >our web page</a>
            </CardText>
            <CardActions>
                <RaisedButton
                        onTouchTap={() => window.open('http://ambar.rdseventeen.com/', '_blank')}
                        label="DOWNLOAD"
                        labelStyle={{ color: '#ffffff' }}
                        style={{ borderRadius: '4px' }}
                        backgroundColor="#8BC34A"
                        />
            </CardActions>
        </Card>
    </Paper>

DemoModeCard.propTypes = {
}

export default DemoModeCard

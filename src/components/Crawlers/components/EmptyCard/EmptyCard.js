import React, { Component } from 'react'
import classes from './EmptyCard.scss'
import formClasses from '../../Crawlers.scss'

import Paper from 'material-ui/Paper'
import { Card, CardText, CardTitle } from 'material-ui/Card'

const EmptyCard = (props) => {    
    return (
        <Paper zDepth={1} className={formClasses.settingsCard}>
            <Card>
                 <CardTitle
                    title='No crawlers'
                    subtitle='No crawlers defined yet...'
                    />             
                 <CardText>
                    <span>Use "Plus" button to create your first crawler</span>
                 </CardText>
            </Card>
        </Paper>   
    )
}

export default EmptyCard

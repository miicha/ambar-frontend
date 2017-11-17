import React, { Component } from 'react'
import classes from './EmptyCard.scss'
import formClasses from '../../Settings.scss'

import Paper from 'material-ui/Paper'
import { Card, CardText, CardTitle } from 'material-ui/Card'

const EmptyCard = ({ localization }) => {
    return (
        <Paper zDepth={1} className={formClasses.settingsCard}>
            <Card>
                <CardTitle
                    title={localization.settingsPage.noCrawlersLabel}
                    subtitle={localization.settingsPage.noCrawlersDescriptionLabel}
                />
                <CardText>
                    <span>{localization.settingsPage.noCrawlersHintLabel}</span>
                </CardText>
            </Card>
        </Paper>
    )
}

EmptyCard.propTypes = {
    localization: React.PropTypes.object.isRequired
}

export default EmptyCard

import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'

import ShareIcon from 'material-ui/svg-icons/social/share'
import FeedbackIcon from 'material-ui/svg-icons/social/mood'
import ProfitIcon from 'material-ui/svg-icons/toggle/star-border'

import classes from './GetMoreSpaceCard.scss'

const GetMoreSpaceCard = () => (<Paper zDepth={1} className={classes.accountCard}>
	<Card>
		<CardTitle title='Get More Space' />
		<CardText style={{ paddingTop: '0', height: '214px' }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<div className={classes.getSpaceCard} onClick={() => window.open('https://ambar.cloud')}>
					<div className={classes.spaceCardHeader}>
						<h3>Get&nbsp;Pro</h3>
						<ProfitIcon/>
					</div>
					<p>Subscribe to Pro account and get 10&nbsp;GB</p>
					<span>+10&nbsp;GB</span>
				</div>
				<div className={classes.getSpaceCard} onClick={() => window.open('mailto:hello@ambar.cloud?subject=Ambar Feedback')}>
					<div className={classes.spaceCardHeader}>
						<h3>Feedback</h3>
						<FeedbackIcon/>
					</div>
					<p>We'd love to hear your feedback</p>
					<span>+125&nbsp;MB</span>
				</div>
				<div className={classes.getSpaceCard} onClick={() => window.open('https://twitter.com/RD17Ambar')}>
					<div className={classes.spaceCardHeader}>
						<h3>Follow</h3>
						<ShareIcon/>
					</div>
					<p>Stay up-to-date with the latest Ambar tweets</p>
					<span>+125&nbsp;MB</span>
				</div>
			</div>
		</CardText>
	</Card>
</Paper>)


export default GetMoreSpaceCard
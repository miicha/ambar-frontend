import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

import { Link } from 'react-router'
import { files } from 'utils'

import classes from './UserInfoCard.scss'

const UserInfoCard = ({ fetching, performLogout, langAnalyzer, name, email, plan, storageMax, storageUsed }) => (
	<Paper zDepth={1} className={classes.accountCard}>
		<Card>
			<CardTitle title='Information' />
			<CardText style={{ paddingTop: '0', height: '170px' }}>
				<div className={classes.userInfo} style={{ display: 'flex', flexDirection: 'column' }}>
					<p><b>Name:</b> {name}</p>
					<p><b>Email:</b> {email}</p>
					<p><b>Plan:</b> {plan}</p>
					<p><b>Uploaded:</b> {files.formatFileSize(storageUsed)} {storageMax != -1 && ` / ${files.formatFileSize(storageMax)}`}</p>
					<p><b>Language Analyzer:</b> {langAnalyzer}</p>
				</div>
			</CardText>
			<CardActions>
				<RaisedButton
					label="Log Out"
					disabled={fetching}
					secondary={true}
					onTouchTap={performLogout} />
			</CardActions>
		</Card>
	</Paper>)

UserInfoCard.propTypes = {
	fetching: React.PropTypes.bool.isRequired,
	performLogout: React.PropTypes.func.isRequired,
	langAnalyzer: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	email: React.PropTypes.string.isRequired,
	plan: React.PropTypes.string.isRequired,
	storageUsed: React.PropTypes.number.isRequired,
	storageMax: React.PropTypes.number.isRequired,

}

export default UserInfoCard
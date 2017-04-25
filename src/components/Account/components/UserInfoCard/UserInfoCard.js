import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import DropDataIcon from 'material-ui/svg-icons/action/delete'

import { Link } from 'react-router'
import { files } from 'utils'

import classes from './UserInfoCard.scss'

const UserInfoCard = ({
	fetching,
	performLogout,
	langAnalyzer,
	name,
	email,
	plan,
	storageMax,
	storageUsed,
	showDropDataDialog,
	toogleDropDataDialog,
	performDataDrop
 }) => {
	const actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={toogleDropDataDialog}
		/>,
		<FlatButton
			label="Drop"
			secondary={true}
			onTouchTap={performDataDrop}
			icon={<DropDataIcon />}
		/>
	]

	return (<Paper zDepth={1} className={classes.accountCard}>
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
				<FlatButton
					label="Drop Data"
					disabled={fetching}
					secondary={true}
					onTouchTap={toogleDropDataDialog}
					icon={<DropDataIcon />} />
			</CardActions>
		</Card>
		<Dialog
			title="Are you sure?"
			actions={actions}			
			open={showDropDataDialog}			
			bodyStyle={{ paddingBottom: 0 }}
			onRequestClose={toogleDropDataDialog}
		>
			<div className={classes.dropDataDescriptionText}>
				<p>
					All data will be dropped from your account, and no one even our support team will not be able to recover it.
				</p>
				<p>
					Click 'DROP' button to remove everything from your Ambar account.
				</p>
			</div>
		</Dialog>
	</Paper>)
}

UserInfoCard.propTypes = {
	fetching: React.PropTypes.bool.isRequired,
	performLogout: React.PropTypes.func.isRequired,
	langAnalyzer: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	email: React.PropTypes.string.isRequired,
	plan: React.PropTypes.string.isRequired,
	storageUsed: React.PropTypes.number.isRequired,
	storageMax: React.PropTypes.number.isRequired,
	showDropDataDialog: React.PropTypes.bool.isRequired,
	toogleDropDataDialog: React.PropTypes.func.isRequired,
	performDataDrop: React.PropTypes.func.isRequired
}

export default UserInfoCard
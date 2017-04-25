import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

import { Link } from 'react-router'
import { files } from 'utils'

import classes from './UserInfoCard.scss'

const UserInfoCard = ({
	fetching,
	performLogout,
	langAnalyzer,
	name,
	email,
	isDefaultUser,
	plan,
	storageMax,
	storageUsed,
	showRemoveUserAccountDialog,
	toggleRemoveUserAccountDialog,
	removeUserAccount
 }) => {
	const actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={toggleRemoveUserAccountDialog}
		/>,
		<FlatButton
			label="Delete"
			secondary={true}
			onTouchTap={removeUserAccount}
			icon={<DeleteIcon />}
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
				{!isDefaultUser && <FlatButton
					label="Delete Account"
					disabled={fetching}
					secondary={true}
					onTouchTap={toggleRemoveUserAccountDialog}
					icon={<DeleteIcon />} /> }
			</CardActions>
		</Card>
		<Dialog
			title="Are you sure?"
			actions={actions}			
			open={showRemoveUserAccountDialog}			
			bodyStyle={{ paddingBottom: 0 }}
			onRequestClose={toggleRemoveUserAccountDialog}
		>
			<div className={classes.dropDataDescriptionText}>
				<p>
					Your Ambar account and all your data will be deleted. Nobody, even Ambar support team will not be able to recover it.
				</p>
				<p>
					Click 'DELETE' button to delete your Ambar account forever.
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
	isDefaultUser: React.PropTypes.bool.isRequired,
	storageUsed: React.PropTypes.number.isRequired,
	storageMax: React.PropTypes.number.isRequired,
	showRemoveUserAccountDialog: React.PropTypes.bool.isRequired,
	toggleRemoveUserAccountDialog: React.PropTypes.func.isRequired,
	removeUserAccount: React.PropTypes.func.isRequired
}

export default UserInfoCard
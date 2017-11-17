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
	removeUserAccount,
	auth,
	localization
 }) => {
	const actions = [
		<FlatButton
			label={localization.accountPage.cancelLabel}
			primary={true}
			onTouchTap={toggleRemoveUserAccountDialog}
		/>,
		<FlatButton
			label={localization.accountPage.deleteLabel}
			secondary={true}
			onTouchTap={removeUserAccount}
			icon={<DeleteIcon />}
		/>
	]

	return (<Paper zDepth={1} className={classes.accountCard}>
		<Card>
			<CardTitle title={localization.accountPage.informationLabel} />
			<CardText style={{ paddingTop: '0', height: '170px' }}>
				<div className={classes.userInfo} style={{ display: 'flex', flexDirection: 'column' }}>
					<p><b>{localization.accountPage.nameLabel}:</b> {name}</p>
					<p><b>{localization.accountPage.emailLabel}:</b> {email}</p>
					<p><b>{localization.accountPage.planLabel}:</b> {plan}</p>
					<p><b>{localization.accountPage.uploadedLabel}:</b> {files.formatFileSize(storageUsed)} {storageMax != -1 && ` / ${files.formatFileSize(storageMax)}`}</p>
					<p><b>{localization.accountPage.langAnalyzerLabel}:</b> {langAnalyzer}</p>
				</div>
			</CardText>
			<CardActions>
				<RaisedButton
					label={localization.accountPage.logOutLabel}
					disabled={fetching || auth == 'none'}
					secondary={true}
					onTouchTap={performLogout} />
				{!isDefaultUser && <FlatButton
					label={localization.accountPage.accountDeletionLabel}
					disabled={fetching}
					secondary={true}
					onTouchTap={toggleRemoveUserAccountDialog}
					icon={<DeleteIcon />} /> }
			</CardActions>
		</Card>
		<Dialog
			title={localization.accountPage.accountDeletionModalTitle}
			actions={actions}			
			open={showRemoveUserAccountDialog}			
			bodyStyle={{ paddingBottom: 0 }}
			onRequestClose={toggleRemoveUserAccountDialog}
		>
			<div className={classes.dropDataDescriptionText}>
				<p>{localization.accountPage.accountDeletionWarnLabel}</p>
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
	removeUserAccount: React.PropTypes.func.isRequired,
	auth: React.PropTypes.string.isRequired,
	localization: React.PropTypes.object.isRequired
}

export default UserInfoCard
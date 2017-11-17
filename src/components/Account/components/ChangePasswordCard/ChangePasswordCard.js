import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import DoneIcon from 'material-ui/svg-icons/action/done'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

import classes from './ChangePasswordCard.scss'

const ChangePasswordCard = ({
	fetching,
	oldPassword,
	oldPasswordError,
	changeOldPassword,
	newPassword,
	newPasswordError,
	changeNewPassword,
	newPasswordConfirmation,
	newPasswordConfirmationError,
	changeNewPasswordConfirmation,
	performPasswordChange,
	localization }) => (
		<Paper zDepth={1} className={classes.accountCard}>
			<Card>
				<CardTitle title={localization.accountPage.changePasswordLabel} />
				<CardText style={{ paddingTop: '0', height: '170px' }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TextField
							hintText={localization.accountPage.oldPasswordLabel}
							type='password'
							disabled={fetching}
							value={oldPassword}
							errorText={oldPasswordError}
							onChange={(event, value) => changeOldPassword(value)}
						/>
						<div>
							<TextField
								hintText={localization.accountPage.newPasswordLabel}
								type='password'
								disabled={fetching}
								value={newPassword}
								errorText={newPasswordError}
								onChange={(event, value) => changeNewPassword(value)}
							/>
							{newPasswordError === '' && newPassword.length > 0 && <DoneIcon color='green' />}
						</div>
						<div>
							<TextField
								hintText={localization.accountPage.newPasswordConfirmationLabel}
								type='password'
								disabled={fetching}
								value={newPasswordConfirmation}
								errorText={newPasswordConfirmationError}
								onChange={(event, value) => changeNewPasswordConfirmation(value)}
							/>
							{newPasswordConfirmationError === '' && newPasswordConfirmation.length > 0 && <DoneIcon color='green' />}
						</div>
					</div>
				</CardText>
				<CardActions>
					<RaisedButton
						label={localization.accountPage.performPasswordChangeLabel}
						primary={true}
						disabled={fetching}
						onTouchTap={performPasswordChange}
					/>
				</CardActions>
			</Card>
		</Paper>)

ChangePasswordCard.propTypes = {
	fetching: React.PropTypes.bool.isRequired,
	oldPassword: React.PropTypes.string.isRequired,
	oldPasswordError: React.PropTypes.string.isRequired,
	changeOldPassword: React.PropTypes.func.isRequired,
	newPassword: React.PropTypes.string.isRequired,
	newPasswordError: React.PropTypes.string.isRequired,
	changeNewPassword: React.PropTypes.func.isRequired,
	newPasswordConfirmation: React.PropTypes.string.isRequired,
	newPasswordConfirmationError: React.PropTypes.string.isRequired,
	changeNewPasswordConfirmation: React.PropTypes.func.isRequired,
	performPasswordChange: React.PropTypes.func.isRequired
}

export default ChangePasswordCard
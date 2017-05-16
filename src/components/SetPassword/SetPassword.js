import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { AuthPageTemplate } from 'components/BasicComponents'
import { Link } from 'react-router'
import DoneIcon from 'material-ui/svg-icons/action/done'
import classes from './SetPassword.scss'

export class SetPassword extends React.Component {
  componentDidMount() {
    const {setPageTitle} = this.props
    setPageTitle('Set Password')
    
    if (this.refs.passwordInputField) {
      this.refs.passwordInputField.focus()
    }

    const { email, token } = this.props.location.query
    const { checkThatLinkIsValid } = this.props

    checkThatLinkIsValid(email, token)
  }

  render() {
    const {
      fetching,
      performPasswordSet,
      email,
      password,
      passwordConfirmation,
      changePassword,
      changePasswordConfirmation,
      passwordError,
      passwordConfirmationError } = this.props

    const passwordHint = <div>
      <div>Minimum password length is 8 symbols</div>
      <div>Password should contain at least 1 uppercase letters, 1 digit, 1 letter</div>
    </div>

    return (<AuthPageTemplate>
      <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', color: '#00acc1', marginTop: 0 }}>Set Password</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            hintText="Email"
            value={email}
            disabled={true}
            onChange={(event, value) => changeEmail(value)}
          />          
          <div>
            <TextField
              hintText="Password"
              type='password'
              ref='passwordInputField'
              disabled={fetching}
              value={password}
              errorText={passwordError}
              onChange={(event, value) => changePassword(value)}
              onKeyPress={(target) => { if (target.charCode === 13) { performPasswordSet() } }}
            />
            {passwordError === '' && password.length > 0 && <DoneIcon color='green' />}
          </div>
          <div>
            <TextField
              hintText="Password Confirmation"
              type='password'
              disabled={fetching}
              value={passwordConfirmation}
              errorText={passwordConfirmationError}
              onChange={(event, value) => changePasswordConfirmation(value)}
              onKeyPress={(target) => { if (target.charCode === 13) { performPasswordSet() } }}
            />
            {passwordConfirmationError === '' && passwordConfirmation.length > 0 && <DoneIcon color='green' />}
          </div>
        </div>
      </CardText>
      <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <RaisedButton
          secondary={true}
          fullWidth={true}
          disabled={fetching}
          label='Submit'
          onTouchTap={() => performPasswordSet()}
        />
      </CardText>
    </AuthPageTemplate>)
  }
}

SetPassword.propTypes = {
  performPasswordSet: React.PropTypes.func.isRequired,
  checkThatLinkIsValid: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
  email: React.PropTypes.string,
  password: React.PropTypes.string,
  passwordConfirmation: React.PropTypes.string,
  changePassword: React.PropTypes.func.isRequired,
  changePasswordConfirmation: React.PropTypes.func.isRequired,
  passwordError: React.PropTypes.string.isRequired,
  passwordConfirmationError: React.PropTypes.string.isRequired
}

export default SetPassword

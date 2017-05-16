import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { AuthPageTemplate } from 'components/BasicComponents'
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import classes from './ResetPassword.scss'

export class ResetPassword extends React.Component {
  componentDidMount() {
    const {setPageTitle} = this.props
    setPageTitle('Reset Password')

    if (this.refs.emailInputField) {
      this.refs.emailInputField.focus()
    }

    const email = this.props.location.query.email
    const {changeEmail} = this.props

    if (email) {
      changeEmail(email)
    }
  }

  render() {
    const {
      fetching,
      performPasswordReset,
      email,
      changeEmail,
      error} = this.props

    return (<AuthPageTemplate>
      <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', color: '#00acc1', marginTop: 0 }}>Reset Password</h2>        
        <TextField
          fullWidth={true}
          hintText="Your Account Email"
          value={email}
          disabled={fetching}
          ref='emailInputField'
          errorText={error}
          onKeyPress={(target) => { if (target.charCode === 13) { performPasswordReset() } }}
          onChange={(event, value) => changeEmail(value)}
        />        
      </CardText>
      <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: '0' }}>
        <RaisedButton
          secondary={true}
          fullWidth={true}
          disabled={fetching}
          label='Reset'
          onTouchTap={() => performPasswordReset()}
        />
      </CardText>
    </AuthPageTemplate>)
  }
}

ResetPassword.propTypes = {
  performPasswordReset: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
  email: React.PropTypes.string,
  changeEmail: React.PropTypes.func.isRequired,
  error: React.PropTypes.string.isRequired
}

export default ResetPassword

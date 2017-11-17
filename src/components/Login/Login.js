import React from 'react'
import { CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import { AuthPageTemplate } from 'components/BasicComponents'
import { Link } from 'react-router'
import classes from './Login.scss'

export class Login extends React.Component {
  componentDidMount() {
    const { setPageTitle, localization } = this.props

    if (this.refs.emailInputField) {
      this.refs.emailInputField.focus()
    }

    setPageTitle(localization.loginPage.pageTitle)
  }

  render() {
    const {
      fetching,
      performLogin,
      email,
      password,
      changePassword,
      changeEmail,
      emailError,
      passwordError,
      location,
      localization 
    } = this.props

    const doLogin = () => {
      if (location.query.url) {
        performLogin(decodeURI(location.query.url.replace('|', '&')))
      } else {
        performLogin()
      }
    }

    return (
      <AuthPageTemplate>
        <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 style={{ textAlign: 'center', color: '#00acc1', marginTop: 0 }}>{localization.loginPage.loginLabel}</h2>
          <TextField
            fullWidth={true}
            hintText={localization.loginPage.emailLabel}
            type="email"
            ref='emailInputField'
            value={email}
            errorText={emailError}
            disabled={fetching}
            onChange={(event, value) => changeEmail(value)}
            onKeyPress={(target) => { if (target.charCode === 13) { doLogin() } }}
          />
          <br />
          <TextField
            fullWidth={true}
            hintText={localization.loginPage.passwordLabel}
            type="password"
            value={password}
            disabled={fetching}
            errorText={passwordError}
            onChange={(event, value) => changePassword(value)}
            onKeyPress={(target) => { if (target.charCode === 13) { doLogin() } }}
          />
        </CardText>
        <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <RaisedButton
            secondary={true}
            fullWidth={true}
            disabled={fetching}
            label={localization.loginPage.performLoginLabel}
            onTouchTap={() => doLogin()}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Link className={classes.link} to={`/reset-password?email=${encodeURI(email)}`}>{localization.loginPage.forgotPasswordLabel}</Link>
            <Link className={classes.link} to="/signup">{localization.loginPage.signupLabel}</Link>
          </div>
        </CardText>
      </AuthPageTemplate>
    )
  }
}

Login.propTypes = {
  performLogin: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
  email: React.PropTypes.string,
  password: React.PropTypes.string,
  changeEmail: React.PropTypes.func.isRequired,
  changePassword: React.PropTypes.func.isRequired,
  emailError: React.PropTypes.string.isRequired,
  passwordError: React.PropTypes.string.isRequired,
  localization: React.PropTypes.object.isRequired
}

export default Login

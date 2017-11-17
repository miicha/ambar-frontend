import { connect } from 'react-redux'
import { changePassword, changeEmail, performLogin } from '../modules/LoginPage'
import { stateValueExtractor } from 'utils/'
import Login from 'components/Login'

const mapDispatchToProps = {
  changePassword,
  changeEmail,
  performLogin
}

const mapStateToProps = (state) => {
  return ({
    email: state['login'].email,
    password: state['login'].password,
    fetching: state['login'].fetching,
    emailError: state['login'].emailError,
    passwordError: state['login'].passwordError,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
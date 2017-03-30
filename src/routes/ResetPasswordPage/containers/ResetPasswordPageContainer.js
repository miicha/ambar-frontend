import { connect } from 'react-redux'
import { changeEmail, performPasswordReset } from '../modules/ResetPasswordPage'
import ResetPassword from 'components/ResetPassword'

const mapDispatchToProps = {
  changeEmail,
  performPasswordReset
}

const mapStateToProps = (state) => {
  return ({
    email: state['resetPassword'].email,
    fetching: state['resetPassword'].fetching,
    error: state['resetPassword'].error
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
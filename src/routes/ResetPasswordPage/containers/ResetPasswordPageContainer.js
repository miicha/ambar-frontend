import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'
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
    error: state['resetPassword'].error,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
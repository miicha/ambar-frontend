import { connect } from 'react-redux'
import { changePassword, changePasswordConfirmation, performPasswordSet, checkThatLinkIsValid } from '../modules/SetPasswordPage'
import SetPassword from 'components/SetPassword'

const mapDispatchToProps = {
  changePassword,
  changePasswordConfirmation,
  performPasswordSet,
  checkThatLinkIsValid
}

const mapStateToProps = (state) => {
  return ({    
    email: state['setPassword'].email,
    password: state['setPassword'].password,
    passwordConfirmation: state['setPassword'].passwordConfirmation,
    fetching: state['setPassword'].fetching,
    passwordError: state['setPassword'].passwordError,
    passwordConfirmationError: state['setPassword'].passwordConfirmationError
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword)
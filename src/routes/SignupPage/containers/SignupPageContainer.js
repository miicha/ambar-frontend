import { connect } from 'react-redux'
import { changeEmail, changeName, performSignup, changeLangAnalyzer, tryToIdentifyUser } from '../modules/SignupPage'
import { stateValueExtractor } from 'utils/'
import Signup from 'components/Signup'

const mapDispatchToProps = {
  changeName,
  changeEmail,
  performSignup,
  changeLangAnalyzer,
  tryToIdentifyUser
}

const mapStateToProps = (state) => {
  return ({
    mode: state['core'].mode,    
    email: state['signup'].email,
    name: state['signup'].name,
    fetching: state['signup'].fetching,
    nameError: state['signup'].nameError,
    emailError: state['signup'].emailError,
    langAnalyzer: state['signup'].langAnalyzer,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
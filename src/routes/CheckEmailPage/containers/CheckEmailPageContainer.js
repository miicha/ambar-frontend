import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'
import { changeEmail, performPasswordReset } from '../modules/CheckEmailPage'
import CheckEmail from 'components/CheckEmail'

const mapDispatchToProps = {  
}

const mapStateToProps = (state) => {
  return ({    
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckEmail)
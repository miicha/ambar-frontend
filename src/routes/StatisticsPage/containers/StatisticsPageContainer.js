import { connect } from 'react-redux'
import { loadStatistics } from '../modules/StatisticsPage'
import Statistics from 'components/Statistics'

const mapDispatchToProps = {    
    loadStatistics    
}

const mapStateToProps = (state) => {
  return ({   
    fetching: state['statisticsPage'].fetching,
    data: state['statisticsPage'].data,
    mode: state['core'].mode
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)
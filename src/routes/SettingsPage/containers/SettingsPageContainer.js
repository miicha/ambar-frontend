import { connect } from 'react-redux'
import { stateValueExtractor } from 'utils/'
import {
  loadCrawlers,
  startStopCrawler,
  deleteCrawler,
  setCrawlerUpdateJSON,
  updateCrawlerFromUpdateJSON,
  setNewCrawlerJSON,
  createNewCrawler,
  refreshCrawler,
  loadPipelineLog,
  setDeleteModalOpen,
  setSettingsModalOpen,
  setCreateCrawlerModalOpen
} from '../modules/SettingsPage'

import Settings from 'components/Settings'

const mapDispatchToProps = {
  loadCrawlers,
  startStopCrawler,
  deleteCrawler,
  setCrawlerUpdateJSON,
  updateCrawlerFromUpdateJSON,
  setNewCrawlerJSON,
  createNewCrawler,
  refreshCrawler,
  loadPipelineLog,
  setDeleteModalOpen,
  setSettingsModalOpen,
  setCreateCrawlerModalOpen
}

const mapStateToProps = (state) => {
  return ({
    fetching: state['global'].fetching,
    crawlers: state['settingsPage'].crawlers,
    newCrawler: state['settingsPage'].newCrawler,
    pipeline: state['settingsPage'].pipeline,
    crawlerJsonTemplate: state['core'].crawlerJsonTemplate,
    mode: state['core'].mode,
    localization: stateValueExtractor.getLocalization(state)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
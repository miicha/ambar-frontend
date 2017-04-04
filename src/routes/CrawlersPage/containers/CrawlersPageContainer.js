import { connect } from 'react-redux'
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
} from '../modules/CrawlersPage'

import Crawlers from 'components/Crawlers'

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
    crawlers: state['crawlersPage'].crawlers,
    newCrawler: state['crawlersPage'].newCrawler,
    pipeline: state['crawlersPage'].pipeline,
    crawlerJsonTemplate: state['core'].crawlerJsonTemplate,
    mode: state['core'].mode
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Crawlers)
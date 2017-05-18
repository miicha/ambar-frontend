import React, { Component } from 'react'

import ContentAdd from 'material-ui/svg-icons/content/add'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import CrawlerCard from './components/CrawlerCard'
import PipelineCard from './components/PipelineCard'
import EmptyCard from './components/EmptyCard'
import CreateCrawlerModal from './components/CreateCrawlerModal'

import classes from './Crawlers.scss'

class Crawlers extends Component {
    componentDidMount() {
        const { loadCrawlers, setNewCrawlerJSON, newCrawler, crawlerJsonTemplate, loadPipelineLog, pipeline, setPageTitle, setAppHeader, mode } = this.props
        setPageTitle('Settings')
        setAppHeader({left: () => 'Settings'})
        loadCrawlers()
        loadPipelineLog(pipeline)
        setNewCrawlerJSON(newCrawler, crawlerJsonTemplate)
    }

    render() {
        const {
            fetching,
            crawlers,
            startStopCrawler,
            deleteCrawler,
            setCrawlerUpdateJSON,
            updateCrawlerFromUpdateJSON,
            setDeleteModalOpen,
            setSettingsModalOpen,
            newCrawler,
            setNewCrawlerJSON,
            createNewCrawler,
            refreshCrawler,
            pipeline,
            loadPipelineLog,
            setCreateCrawlerModalOpen,
            mode } = this.props

        return (
            <div className='pageContainer'>
                {!fetching &&
                    <PipelineCard pipeline={pipeline} loadPipelineLog={loadPipelineLog} />
                }
                {!fetching && crawlers && crawlers.size > 0 && Array.from(crawlers.values()).map((crawler, idx) =>
                    <CrawlerCard
                        key={crawler.settings.id}
                        crawler={crawler}
                        startStopCrawler={startStopCrawler}
                        refreshCrawler={refreshCrawler}
                        deleteCrawler={deleteCrawler}
                        setCrawlerUpdateJSON={setCrawlerUpdateJSON}
                        updateCrawlerFromUpdateJSON={updateCrawlerFromUpdateJSON}
                        setDeleteModalOpen={setDeleteModalOpen}
                        setSettingsModalOpen={setSettingsModalOpen}
                    />)
                }
                {!fetching && (!crawlers || crawlers.size == 0) &&
                    <EmptyCard />
                }
                {!fetching &&
                    <div>
                        <div style={{ display: 'flex', position: 'fixed', bottom: '10%', right: '20px' }}>
                            <FloatingActionButton
                                backgroundColor='#FF5252'
                                className={classes.addButton}
                                zDepth={4}
                                secondary={true}
                                onTouchTap={() => setCreateCrawlerModalOpen(newCrawler, true)}>
                                <ContentAdd />
                            </FloatingActionButton>
                        </div>
                        <CreateCrawlerModal
                            newCrawler={newCrawler}
                            setCreateCrawlerModalOpen={setCreateCrawlerModalOpen}
                            setNewCrawlerJSON={setNewCrawlerJSON}
                            createNewCrawler={createNewCrawler}
                        />
                    </div>
                }
            </div>
        )
    }
}

Crawlers.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    crawlers: React.PropTypes.object.isRequired,
    pipeline: React.PropTypes.object.isRequired,
    loadCrawlers: React.PropTypes.func.isRequired,
    startStopCrawler: React.PropTypes.func.isRequired,
    deleteCrawler: React.PropTypes.func.isRequired,
    setCrawlerUpdateJSON: React.PropTypes.func.isRequired,
    updateCrawlerFromUpdateJSON: React.PropTypes.func.isRequired,
    newCrawler: React.PropTypes.object.isRequired,
    setNewCrawlerJSON: React.PropTypes.func.isRequired,
    createNewCrawler: React.PropTypes.func.isRequired,
    refreshCrawler: React.PropTypes.func.isRequired,
    crawlerJsonTemplate: React.PropTypes.string.isRequired,
    loadPipelineLog: React.PropTypes.func.isRequired,
    setCreateCrawlerModalOpen: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
    mode: React.PropTypes.string.isRequired
}

export default Crawlers
import React, { Component, PropTypes } from 'react'
import SideMenu from './components/SideMenu'
import RefineSearchModal from './components/RefineSearchModal'
import { AmbarResponsiveLogo } from 'components/BasicComponents'
import AppBarTitle from './components/AppBarTitle'
import AppBar from 'material-ui/AppBar'
import LinearProgress from 'material-ui/LinearProgress'

import classes from './MainLayout.scss'

class MainLayout extends Component {
    render() {
        const {
            children,
            fetching,
            changeLocation,
            location,
            toggleSideMenu,
            isSideMenuOpen,
            header,
            showSearchInput,
            query,
            setQuery,
            performSearch,
            mode,
            sources,
            isRefineSearchModalOpen,
            toggleRefineSearchModal,
            toggleSourceSelected,
            allowedRoutes,
            setAppTitle,
            setHeader
        } = this.props

        return (
            <div>
                <div>
                    {fetching && <LinearProgress style={{ position: 'fixed', top: '64px', zIndex: '2000' }} color="#FFAB00" />}
                    <SideMenu isOpen={isSideMenuOpen} currentLocation={location} toggleSideMenu={toggleSideMenu} changeLocation={changeLocation} mode={mode} allowedRoutes={allowedRoutes} />
                    <RefineSearchModal
                        isRefineSearchModalOpen={isRefineSearchModalOpen}
                        toggleRefineSearchModal={toggleRefineSearchModal}
                        sources={sources}
                        toggleSourceSelected={toggleSourceSelected}
                    />
                    <AppBar
                        title={<AppBarTitle showSearchInput={showSearchInput}
                            title={header}
                            setQuery={setQuery}
                            query={query}
                            performSearch={performSearch}
                            fetching={fetching}
                            toggleRefineSearchModal={toggleRefineSearchModal}
                            mode={mode} />}
                        style={{ position: 'fixed', top: 0, left: 0 }}
                        zDepth={2}
                        onLeftIconButtonTouchTap={toggleSideMenu}
                        iconElementRight={<AmbarResponsiveLogo />}
                    />
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div className={classes.mainContainer}>
                            {React.cloneElement(children, { setAppTitle: setAppTitle, setHeader: setHeader })}                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired,
        allowedRoutes: React.PropTypes.array.isRequired,

        children: React.PropTypes.element.isRequired,

        fetching: React.PropTypes.bool.isRequired,

        isSideMenuOpen: React.PropTypes.bool.isRequired,
        toggleSideMenu: React.PropTypes.func.isRequired,

        location: React.PropTypes.string.isRequired,
        changeLocation: React.PropTypes.func.isRequired,
        header: React.PropTypes.string.isRequired,

        showSearchInput: React.PropTypes.bool.isRequired,
        setQuery: React.PropTypes.func.isRequired,
        performSearch: React.PropTypes.func.isRequired,
        query: React.PropTypes.string.isRequired,

        isRefineSearchModalOpen: React.PropTypes.bool.isRequired,
        toggleRefineSearchModal: React.PropTypes.func.isRequired,

        sources: React.PropTypes.object.isRequired,
        toggleSourceSelected: React.PropTypes.func.isRequired
    }
}

export default MainLayout

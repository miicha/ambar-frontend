import React, { Component, PropTypes } from 'react'
import SideMenu from './components/SideMenu'
import RateUs from './components/RateUs'
import { AmbarResponsiveLogo } from 'components/BasicComponents'
import AppBarTitle from './components/AppBarTitle'
import AppBar from 'material-ui/AppBar'
import MediaQuery from 'react-responsive'
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
            mode,
            version,
            allowedRoutes,
            setPageTitle,
            setAppHeader,
            showRateUsModal,
            toggleRateUsModal,
            state
        } = this.props

        return (
            <div style={{height: '100%'}}>
                <div style={{height: '100%'}}>
                    {fetching && <LinearProgress style={{ position: 'fixed', top: '64px', zIndex: '2000' }} color="#FFAB00" />}
                    <SideMenu
                        isOpen={isSideMenuOpen}
                        currentLocation={location}
                        toggleSideMenu={toggleSideMenu}
                        changeLocation={changeLocation}
                        mode={mode}
                        allowedRoutes={allowedRoutes} />
                    <AppBar
                        title={<AppBarTitle
                            data={header}
                            fetching={fetching}
                            currentApplicationState={state}
                            />}
                        style={{ position: 'fixed', top: 0, left: 0 }}
                        zDepth={2}
                        onLeftIconButtonTouchTap={toggleSideMenu}
                        iconElementRight={<div style={{ display: 'flex', flexDirection: 'row' }}>
                            {mode !== 'ee' && <MediaQuery query='(min-width: 1024px)'>
                                <RateUs isOpen={showRateUsModal} toggle={toggleRateUsModal} />
                            </MediaQuery>}
                            <AmbarResponsiveLogo version={version} mode={mode} />
                        </div>}
                    />
                    <div style={{ maxWidth: '1200px', margin: '0 auto', height: '100%', overflowY: 'hidden', paddingTop: '70px' }}>
                        <div style={{height: '100%', overflowY: 'auto'}}>
                            {React.cloneElement(children, { setPageTitle: setPageTitle, setAppHeader: setAppHeader })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired,
        version: React.PropTypes.string.isRequired,
        allowedRoutes: React.PropTypes.array.isRequired,

        children: React.PropTypes.element.isRequired,

        fetching: React.PropTypes.bool.isRequired,

        isSideMenuOpen: React.PropTypes.bool.isRequired,
        toggleSideMenu: React.PropTypes.func.isRequired,

        location: React.PropTypes.string.isRequired,
        changeLocation: React.PropTypes.func.isRequired,
        header: React.PropTypes.object.isRequired,

        showRateUsModal: React.PropTypes.bool.isRequired,
        toggleRateUsModal: React.PropTypes.func.isRequired,

        setAppHeader: React.PropTypes.func.isRequired,
        setPageTitle: React.PropTypes.func.isRequired,

        state: React.PropTypes.object.isRequired
    }
}

export default MainLayout

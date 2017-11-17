import React, { Component } from 'react'
import DropboxCard from './components/DropboxCard'
import GetMoreSpaceCard from './components/GetMoreSpaceCard'
import UserInfoCard from './components/UserInfoCard'
import ChangePasswordCard from './components/ChangePasswordCard'

import classes from './Account.scss'

class Account extends Component {

    componentDidMount() {
        const { setPageTitle, loadUserInfo, setAppHeader, localization } = this.props
        setPageTitle(localization.accountPage.pageTitle)
        setAppHeader({ left: () => localization.accountPage.pageTitle })
        loadUserInfo()
    }

    render() {
        const {
            mode,
            fetching,
            performLogout,
            isDefaultUser,
            email,
            name,
            plan,
            langAnalyzer,
            storageMax,
            storageUsed,
            oldPassword,
            newPassword,
            newPasswordConfirmation,
            oldPasswordError,
            newPasswordError,
            newPasswordConfirmationError,
            changeOldPassword,
            changeNewPassword,
            changeNewPasswordConfirmation,
            performPasswordChange,
            showRemoveUserAccountDialog,
            toggleRemoveUserAccountDialog,
            removeUserAccount,

            dropboxCrawler,
            initDropboxCrawler,
            deleteDropboxCrawler,

            auth,

            localization

        } = this.props

        return (
            <div className='pageContainer' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <UserInfoCard
                    isDefaultUser={isDefaultUser}
                    email={email}
                    name={name}
                    plan={plan}
                    langAnalyzer={langAnalyzer}
                    storageMax={storageMax}
                    storageUsed={storageUsed}
                    fetching={fetching}
                    performLogout={performLogout}
                    showRemoveUserAccountDialog={showRemoveUserAccountDialog}
                    toggleRemoveUserAccountDialog={toggleRemoveUserAccountDialog}
                    removeUserAccount={removeUserAccount}
                    auth={auth}
                    localization={localization}
                />
                <ChangePasswordCard
                    fetching={fetching}
                    oldPassword={oldPassword}
                    newPassword={newPassword}
                    newPasswordConfirmation={newPasswordConfirmation}
                    oldPasswordError={oldPasswordError}
                    newPasswordError={newPasswordError}
                    newPasswordConfirmationError={newPasswordConfirmationError}
                    performPasswordChange={performPasswordChange}
                    changeOldPassword={changeOldPassword}
                    changeNewPassword={changeNewPassword}
                    changeNewPasswordConfirmation={changeNewPasswordConfirmation}
                    localization={localization}
                />
                {mode === 'cloud' && <DropboxCard
                    dropboxCrawler={dropboxCrawler}
                    fetching={fetching}
                    deleteDropboxCrawler={deleteDropboxCrawler}
                    initDropboxCrawler={initDropboxCrawler} />}
                {mode === 'cloud' && plan === 'Free' && <GetMoreSpaceCard />}
            </div>
        )
    }
}

Account.propTypes = {
    mode: React.PropTypes.string.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
    loadUserInfo: React.PropTypes.func.isRequired,
    performLogout: React.PropTypes.func.isRequired,
    email: React.PropTypes.string,
    name: React.PropTypes.string,
    plan: React.PropTypes.string,
    isDefaultUser: React.PropTypes.bool.isRequired,
    langAnalyzer: React.PropTypes.string,
    storageMax: React.PropTypes.number,
    storageUsed: React.PropTypes.number,
    fetching: React.PropTypes.bool.isRequired,
    oldPassword: React.PropTypes.string.isRequired,
    newPassword: React.PropTypes.string.isRequired,
    newPasswordConfirmation: React.PropTypes.string.isRequired,
    oldPasswordError: React.PropTypes.string.isRequired,
    newPasswordError: React.PropTypes.string.isRequired,
    newPasswordConfirmationError: React.PropTypes.string.isRequired,
    performPasswordChange: React.PropTypes.func.isRequired,
    changeOldPassword: React.PropTypes.func.isRequired,
    changeNewPassword: React.PropTypes.func.isRequired,
    changeNewPasswordConfirmation: React.PropTypes.func.isRequired,
    showRemoveUserAccountDialog: React.PropTypes.bool.isRequired,

    dropboxCrawler: React.PropTypes.object,
    initDropboxCrawler: React.PropTypes.func.isRequired,
    deleteDropboxCrawler: React.PropTypes.func.isRequired,

    toggleRemoveUserAccountDialog: React.PropTypes.func.isRequired,
    removeUserAccount: React.PropTypes.func.isRequired,
    auth: React.PropTypes.string.isRequired,
    localization: React.PropTypes.object.isRequired
}

export default Account
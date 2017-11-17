import AuthLayout from './AuthLayout'
import MainLayout from './MainLayout'
import CoreLayout from './CoreLayout'

import SearchPage from './SearchPage'
import SettingsPage from './SettingsPage'
import StatisticsPage from './StatisticsPage'
import AccountPage from './AccountPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import SetPassword from './SetPasswordPage'
import ResetPassword from './ResetPasswordPage'
import DropboxPage from './DropboxPage'
import CheckEmailPage from './CheckEmailPage'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout(store),
  childRoutes: [
    {
      component: AuthLayout(MainLayout(store), store),
      indexRoute: SearchPage(store),
      childRoutes: [
        SettingsPage(store),
        StatisticsPage(store),
        AccountPage(store),
        DropboxPage(store)
      ]
    },
    LoginPage(store),
    SignupPage(store),
    SetPassword(store),
    ResetPassword(store),
    CheckEmailPage(store)    
  ]
})

export default createRoutes

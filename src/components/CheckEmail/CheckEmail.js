import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FullScreenPattern from 'components/BasicComponents/FullScreenPattern'
import classes from './CheckEmail.scss'

export class CheckEmail extends React.Component {
  componentDidMount() {
    const { setPageTitle, localization } = this.props
    setPageTitle(localization.checkEmailPage.pageTitle)
  }

  render() {
    const { localization } = this.props

    return (<FullScreenPattern>
      <Paper zDepth={5} style={{ backgroundColor: 'white' }}>
        <Card containerStyle={{ padding: 0, minWidth: '300px' }}>
          <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <h2 style={{ textAlign: 'center', color: '#00acc1', marginTop: 0 }}>{localization.checkEmailPage.pageTitle}</h2>
            <img src='post-owl.jpeg' alt='post-owl' />
            <p>{localization.checkEmailPage.hintLabel}</p>
          </CardText>
        </Card>
      </Paper>
    </FullScreenPattern>)
  }
}



export default CheckEmail

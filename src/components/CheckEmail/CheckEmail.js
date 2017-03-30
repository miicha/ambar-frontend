import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FullScreenPattern from 'components/BasicComponents/FullScreenPattern'
import classes from './CheckEmail.scss'

export class CheckEmail extends React.Component {
  componentDidMount() {
    const {setAppTitle} = this.props
    setAppTitle('Check Your Inbox')
  }

  render() {
    return (<FullScreenPattern>
      <Paper zDepth={5} style={{ backgroundColor: 'white' }}>
        <Card containerStyle={{ padding: 0, minWidth: '300px' }}>
          <CardText style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <h2 style={{ textAlign: 'center', color: '#00acc1', marginTop: 0 }}>Check Your Inbox</h2>
            <img src='post-owl.jpeg' alt='post-owl' />
            <p>Hedwig is on its way! The message will be delivered very soon</p>
          </CardText>
        </Card>
      </Paper>
    </FullScreenPattern>)
  }
}



export default CheckEmail

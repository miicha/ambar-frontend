import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import FacebookIcon from './assets/facebook.svg'
import GithubIcon from './assets/github.svg'
import TwitterIcon from './assets/twitter.svg'

import classes from './RateUs.scss'

class RateUs extends Component {
    constructor() {
        super()
    }

    render() {
        const { isOpen, toggle } = this.props

        const goToUrl = (url) => {
            window.open(url)
        }

        const actions = [
            <FlatButton
                label="Follow"
                primary={true}
                onTouchTap={() => goToUrl('https://www.facebook.com/Ambar-Smart-Document-Archive-1494459153928382/')}
                icon={<img height={20} src={FacebookIcon} />}
            />,
            <FlatButton
                label="Star"
                primary={true}
                onTouchTap={() => goToUrl('https://github.com/RD17/ambar')}
                icon={<img height={20} src={GithubIcon} />}
            />,
            <FlatButton
                label="Follow"
                primary={true}
                onTouchTap={() => goToUrl('https://twitter.com/RD17Ambar')}
                icon={<img height={20} src={TwitterIcon} />}
            />
        ]

        return (
            <div className={classes.stampIconContainer}>
                <img className={classes.stampIcon} src='./stamp-icon.png' width='48' height='48' title='Rate Us' onClick={() => toggle(true)} />
                <Dialog
                    title="Thanks for choosing Ambar!"
                    actions={actions}                    
                    open={isOpen}
                    actionsContainerStyle={{ textAlign: 'center' }}
                    onRequestClose={() => toggle(false)}
                >
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginRight: '20px' }}>
                            <img style={{ maxHeight: '250px' }} src='/rate-us-owl.gif' alt='Rate Us' />
                        </div>
                        <div className={classes.rateUsText}>
                            <p>
                                Let's spread the word that Ambar is awesome! Help us make Ambar even better, follow us on Twitter and Facebook or give us you stars on Github. 
                            </p>
                            <p>
                                Together we will build the best document management system in the world!
                            </p>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

RateUs.propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired
}

export default RateUs

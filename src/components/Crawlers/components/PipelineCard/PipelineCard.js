import React, { Component } from 'react'
import { Card, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import LogView from '../LogView'

import classes from './PipelineCard.scss'
import formClasses from '../../Crawlers.scss'

class PipelineCard extends Component {
    componentDidMount() {
        const {pipeline, loadPipelineLog} = this.props
        this.updateDescriptor = setInterval(() => loadPipelineLog(pipeline), 3 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.updateDescriptor)
    }

    render() {
        const { pipeline: {log}} = this.props
            
            return (
                <Paper zDepth={1} className={formClasses.settingsCard}>
                    <Card>
                        <CardTitle
                            title='Pipeline'
                            subtitle='File processor'
                            actAsExpander={true}
                            showExpandableButton={true}
                            />             
                        <CardText expandable={true}>
                            <LogView log={log} style={{height: '630px'}} />                
                        </CardText>
                    </Card>
                </Paper>   
            )
    }
}

PipelineCard.propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    loadPipelineLog: React.PropTypes.func.isRequired
}

export default PipelineCard

import React, { Component } from 'react'
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import { files } from 'utils'
import { Link } from 'react-router'
import MediaQuery from 'react-responsive'
import ContentTypeChart from './components/ContentTypeChart'
import ProcessingRateChart from './components/ProcessingRateChart'
import classes from './Statistics.scss'

const StatisticsCard = ({ title, children }) => {
    return (
        <Paper zDepth={1} className={classes.statisticsCard}>
            <Card>
                <CardTitle title={title} />
                <CardText style={{ paddingTop: 0 }}>
                    {children}
                </CardText>
            </Card>
        </Paper>
    )
}

const ChartCard = ({ children }) => {
    return (
        <MediaQuery query='(min-width: 1024px)'>
            {(matches) => {
                if (matches) {
                    return <div style={{ display: 'flex', width: '50%' }}>{children}</div>
                } else {
                    return <div style={{ display: 'flex', width: '100%' }}>{children}</div>
                }
            }
            }
        </MediaQuery>
    )
}

class Statistics extends Component {

    componentDidMount() {
        const { loadStatistics, setPageTitle, setAppHeader, mode } = this.props
        setPageTitle('Statistics')
        setAppHeader({left: () => 'Statistics'})
        loadStatistics()
    }

    render() {
        const { fetching, data, mode } = this.props

        const chartCardStyle = { display: 'flex', minWidth: '50%', maxWidth: '100%' }

        return (
            <div>
                {!fetching && data.procTotal.totalCount > 0 &&
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <Paper zDepth={1} className={classes.statisticsCard}>
                                <Card>
                                    <CardTitle title={"Summary"} />
                                    <CardText style={{ paddingTop: "0" }} >
                                        <p style={{ marginTop: 0 }}>
                                            Files ready for search:&nbsp;
                                                    <b>{data.procTotal.totalCount} ({files.formatFileSize(data.procTotal.sizeDataInBytes.sum)})</b>
                                        </p>
                                        <p>
                                            Average file size:&nbsp;
                                                    <b>{files.formatFileSize(data.procTotal.sizeDataInBytes.avg)}</b>
                                        </p>
                                        <p>
                                            Maximum file size:&nbsp;
                                                    <b>{files.formatFileSize(data.procTotal.sizeDataInBytes.max)}</b>
                                        </p>
                                    </CardText>
                                </Card>
                            </Paper>
                        </div>
                        <ChartCard>
                            <StatisticsCard title='Content Types'>
                                <ContentTypeChart data={data.contentType} />
                            </StatisticsCard>
                        </ChartCard>
                        <ChartCard>
                            <StatisticsCard title='Processing Rate'>
                                <ProcessingRateChart data={data.procRate} />
                            </StatisticsCard>
                        </ChartCard>
                    </div>
                }
                {!fetching && data.procTotal.totalCount === 0 &&
                    <div className={classes.statisticsCardsContainer}>
                        <StatisticsCard title='No documents - No statistics'>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img style={{ maxHeight: '150px' }} src='/animated-owl.gif' alt='Oops' />
                            </div>
                            <p>Oops, your Ambar is empty...</p>
                            {mode === 'cloud' && <p>Upload files manually on <Link to='/' className={classes.link}>Search Page</Link> or integrate your <Link to='/account' className={classes.link}>Dropbox account</Link></p>}
                        </StatisticsCard>
                    </div>
                }
            </div>
        )
    }
}

Statistics.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
    loadStatistics: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
    mode: React.PropTypes.string.isRequired
}

export default Statistics
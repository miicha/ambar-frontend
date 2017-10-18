import React, { Component } from 'react'
import moment from 'moment'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'

import SearchCard from 'routes/SearchPage/containers/SearchCardContainer'
import TableRowResult from './components/TableRow'
import classes from './TableView.scss'

class TableView extends Component {
    render() {
        const {
            hits,
            searchQuery,
            toggleImagePreview
        } = this.props

        return (
            <Table selectable={false} bodyStyle={{ overflow: 'visible', marginBottom: '200px' }}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '60px', paddingLeft: '15px', paddingRight: '5px' }}></TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '35%' }}>File Name</TableHeaderColumn>
                        <TableHeaderColumn>Size</TableHeaderColumn>
                        <TableHeaderColumn>Tags</TableHeaderColumn>
                        <TableHeaderColumn>Author</TableHeaderColumn>
                        <TableHeaderColumn>Last Modified</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: '220px' }}>Actions</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} preScanRows={false} style={{ marginBottom: '100px' }}>
                    {hits.map((hit, idx) =>
                        <SearchCard
                            key={hit.file_id}
                            fileId={hit.file_id}
                            Component={TableRowResult}
                        />
                    )}
                </TableBody>
            </Table>
        )
    }
}

TableView.propTypes = {
    hits: React.PropTypes.array.isRequired
}

export default TableView

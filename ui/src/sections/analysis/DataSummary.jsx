import React from 'react'
import Papa from 'papaparse'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import { AnalysisContext } from './AnalysisDataProvider'


export default class DataSummary extends React.Component {

  render() {
    if (!this.context) {
      return (
        <Typography>There's currently no data to be presented, please go to the Home tab to load</Typography>
      )
    }

    const csv_data = this.context.raw_data;

    return (
      <div>
        <Typography><b>Number of rows:</b> {csv_data.length}</Typography><br />
        <Typography><b>Fields found in data:</b> {Object.keys(csv_data[0]).join(', ')}</Typography><br />
        <Typography><b>Identified text fields:</b> {this.context.initial_filters.text.join(', ')}</Typography><br />
        <Typography><b>Identified rating fileds:</b> {this.context.initial_filters.rating.join(', ')}</Typography><br />
        <Typography><b>First data row:</b></Typography><br />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Field name</TableCell>
              <TableCell align="left">Field value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(csv_data[0]).map(key => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell align="left">{csv_data[0][key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

DataSummary.contextType = AnalysisContext;

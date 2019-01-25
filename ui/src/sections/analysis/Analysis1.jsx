import React from 'react'
import Papa from 'papaparse'


import { AnalysisContext } from './AnalysisDataProvider'


export default class Analysis1 extends React.Component {
  render() {
    let csv_data = this.context;
    if (!csv_data) {
      return <p>No data</p>
    }

    return (
      <div>
        <p>data</p>
        <p>Number of rows: {csv_data.length}</p>
        <p>First row: {csv_data[0].join(', ')}</p>
        <p>Second row: {csv_data[1].join(', ')}</p>
        <p>Last row: {csv_data[csv_data.length - 1].join(', ')}</p>
      </div>
    )
  }
}

Analysis1.contextType = AnalysisContext;

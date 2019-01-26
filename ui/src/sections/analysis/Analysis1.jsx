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
        <p>First row: {JSON.stringify(csv_data[0])}</p>
        <p>Second row: {JSON.stringify(csv_data[1])}</p>
        <p>Last row: {JSON.stringify(csv_data[csv_data.length - 1])}</p>
      </div>
    )
  }
}

Analysis1.contextType = AnalysisContext;

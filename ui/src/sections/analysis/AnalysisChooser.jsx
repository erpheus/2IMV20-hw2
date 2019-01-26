import React from 'react'
import Papa from 'papaparse'


import { AnalysisChoosingContext } from './AnalysisDataProvider'


export default class AnalysisChooser extends React.Component {

  render() {
    let analysis_data = this.context;
    if (!analysis_data) {
      return null;
    }

    return (
      <div>
        <h3>Load analysis data</h3>
        <button onClick={() => {analysis_data.loadData('small')}}>
          Load small dataset
        </button>
        <button onClick={() => {analysis_data.loadData('full')}}>
          Load full dataset
        </button>
        <p>State: {analysis_data.state}</p>
      </div>
    )
  }
}

AnalysisChooser.contextType = AnalysisChoosingContext;



      



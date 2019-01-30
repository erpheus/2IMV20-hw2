import React from 'react'
import Papa from 'papaparse'

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


import { AnalysisChoosingContext } from './AnalysisDataProvider'


export default class AnalysisChooser extends React.Component {

  render() {
    let analysis_data = this.context;
    if (!analysis_data) {
      return null;
    }

    return (
      <div style={{marginTop: 50}}>
        <Typography component="h4" variant="h4" gutterBottom>Load analysis data</Typography>
        <Button variant="contained" onClick={() => {analysis_data.loadData('small')}}>
          Load small dataset
        </Button>
        <Button style={{marginLeft: 40}} variant="contained" onClick={() => {analysis_data.loadData('full')}}>
          Load full dataset
        </Button>
        <Typography style={{marginTop: 20}}>State: {analysis_data.state}</Typography>
      </div>
    )
  }
}

AnalysisChooser.contextType = AnalysisChoosingContext;



      



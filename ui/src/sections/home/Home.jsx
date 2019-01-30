import React from 'react'
import {Link} from 'react-router-dom'
import Typography from '@material-ui/core/Typography';

import AnalysisChooser from '../analysis/AnalysisChooser'

export default function Home() {
  return (
    <React.Fragment>
      <Typography>This app will help you find the job that most fits your needs amongst big tech companies.</Typography>
      <Typography>Choose one of the datasets below and navigate to the other tabs to learn more.</Typography>
      <AnalysisChooser />
    </React.Fragment>
  )
}

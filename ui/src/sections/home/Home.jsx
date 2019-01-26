import React from 'react'
import {Link} from 'react-router-dom'
import Typography from '@material-ui/core/Typography';

import AnalysisChooser from '../analysis/AnalysisChooser'

export default function Home() {
  return (
    <React.Fragment>
      <Typography>This app will help you find the job that most fits your needs amongst big tech companies.</Typography>
      <Typography>Choose one of the analysis below to learn more.</Typography>
      <AnalysisChooser />
    </React.Fragment>
  )
}

import React from 'react'
import {Link, Route} from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import './base.css'

import Home from './home/Home'

import Analysis1 from './analysis/Analysis1'
import RatingComparison from './analysis/RatingComparison'
import TextComparison from './analysis/TextComparison'
import AnalysisDataProvider from './analysis/AnalysisDataProvider'

export default function Base() {
  return (
    <React.Fragment>
      <div style={{maxWidth: 1400, margin: '40px auto', padding: 40}}>
        <Paper style={{padding: 40}}>
          <Typography component="h2" variant="h2" gutterBottom>Employee reviews explorer</Typography>
          <Typography>Glassdoor data analysis tool</Typography>
        </Paper>
        <Paper style={{marginTop: 40}}>
          <Route path="/" render={({ location }) => (
            <Tabs value={location.pathname} variant="fullWidth">
              <Tab label="Home" component={Link} to={'/'} value={'/'}/>
              <Tab label="Data summary" component={Link} to={'/analysis1'} value={'/analysis1'}/>
              <Tab label="Rating Analysis" component={Link} to={'/analysis_rating'} value={'/analysis_rating'}/>
              <Tab label="Text Analysis" component={Link} to={'/analysis_text'} value={'/analysis_text'}/>
            </Tabs>
          )} />
          <div style={{padding: 40}}>
            <AnalysisDataProvider>
              <Route exact={true} path="/" component={Home}/>
              <Route path="/analysis1" component={Analysis1}/>
              <Route path="/analysis_rating" component={RatingComparison}/>
              <Route path="/analysis_text" component={TextComparison} />
            </AnalysisDataProvider>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  )
}

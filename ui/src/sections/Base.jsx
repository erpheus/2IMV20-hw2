import React from 'react'
import {Link, Route} from 'react-router-dom'

import './base.css'

import Home from './home/Home'

import Analysis1 from './analysis/Analysis1'
import AnalysisDataProvider from './analysis/AnalysisDataProvider'

export default function Base() {
  return (
    <React.Fragment>
      <h1>Employee reviews explorer</h1>
      <Route exact={true} path="/" component={Home}/>
      <div className="navigation">
        <Route path="/a*" render={() => (
          <Link to={'/'} style={{margin: 10}}>Home</Link>
        )} />
        <Link to={'/analysis1'} style={{margin: 10}}>Analysis 1</Link>
      </div>

      <AnalysisDataProvider>
        <Route path="/analysis1" component={Analysis1}/>
      </AnalysisDataProvider>
    </React.Fragment>
  )
}

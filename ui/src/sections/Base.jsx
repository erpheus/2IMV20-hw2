import React from 'react'
import {Route} from 'react-router-dom'

import './base.css'

import Home from './home/Home'

import Analysis1 from './analysis/Analysis1'

export default function Base() {
  return (
    <React.Fragment>
      <Route exact={true} path="/" component={Home}/>
      <Route exact={true} path="/analysis1" component={Analysis1}/>
    </React.Fragment>
  )
}

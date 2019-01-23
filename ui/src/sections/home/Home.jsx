import React from 'react'
import {Link} from 'react-router-dom'

import CenteredImage from '~/components/centered-image'


export default function Home() {
  return (
    <React.Fragment>
      <h1>Employee reviews analysis</h1>
      <Link to={'/analysis1'} >analysis1</Link>
    </React.Fragment>
  )
}

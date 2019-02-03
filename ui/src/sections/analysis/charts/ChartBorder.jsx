import React from 'react'
import Typography from '@material-ui/core/Typography';

export default function ChartBorder(props) {
  return (
    <div style={{border: '1px solid #ddd', borderRadius: 7, position: 'relative', margin: 10, padding: 10}}>
      <Typography style={{display: 'block', position: 'absolute', top: '-0.6em', left: 30, background: 'white', paddingLeft: 20, paddingRight: 20, color: '#888'}}>{props.title}</Typography>
      {props.children}
    </div>
  )
}

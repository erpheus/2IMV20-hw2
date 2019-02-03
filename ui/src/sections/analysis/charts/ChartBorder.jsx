import React from 'react'
import Typography from '@material-ui/core/Typography';

export default function ChartBorder(props) {
  const extra = {};
  if (props.id) {
    extra.id = props.id
  }
  return (
    <div style={{border: '1px solid #ddd', borderRadius: 7, position: 'relative', margin: 10, padding: 10}} {...extra}>
      <Typography style={{display: 'block', position: 'absolute', top: '-0.6em', left: 30, background: 'white', paddingLeft: 20, paddingRight: 20, color: '#888'}}>{props.title}</Typography>
      {props.children}
    </div>
  )
}

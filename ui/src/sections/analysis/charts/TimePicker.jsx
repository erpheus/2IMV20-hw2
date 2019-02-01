import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, LineChart, Brush
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class TimePicker extends React.Component {
  constructor(props, context) {
    super(props)
    this.state = {
      start: 0,
      end: context.all_timed_data.length
    }
  }

  onBrushChange({startIndex, endIndex}) {
    this.setState({start: startIndex, end: endIndex});
    let since = this.context.all_timed_data[startIndex].time;
    let to = this.context.all_timed_data[endIndex].time;
    since = (new Date(since)).valueOf()
    to = (new Date(to)).valueOf()
    this.props.onRangeChange(since, to)
  }


  render() {
    const { all_timed_data } = this.context;
    //console.log('state', this.state)

    return (
      <React.Fragment>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={all_timed_data}>
              <Brush height={30} stroke="#8884d8" dataKey="time" onChange={e => this.onBrushChange(e)}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

TimePicker.contextType = AnalysisContext;

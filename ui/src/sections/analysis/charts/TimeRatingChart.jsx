import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts'
const d3 = require('d3-shape')


import { AnalysisContext } from '../AnalysisDataProvider'

export default class TimeRatingChart extends React.Component {

  constructor(props, context) {
    super(props)
    this.state = {
      min: 0,
      max: Math.max(...context.all_timed_data.map(e => Math.max(...context.filters.company.map(c => e.avgs[props.rating][this.data_key_f(c)]).filter(n => !Number.isNaN(n)))))
    }
  } 

  data_key_f(company) {
    if (this.props.count) {
      return `${company}_count`;
    }
    return company;
  }

  render() {
    const { colors, filters, timed_data, all_timed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    const rating = this.props.rating;

    const curve_type = d3.curveBundle.beta(.75);

    const tooltip_options = {}
    if (!this.props.count) {
      tooltip_options["formatter"]=((value) => Number.isNaN(value) ? '-' : (''+value).slice(0,4))
    }

    return (
      <React.Fragment>
        <div style={{margin: '0 auto', marginTop: 20, marginBottom: 15}}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timed_data.map(e => ({time: e.time, ...e.avgs[rating]}))} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="time"/>
              <YAxis domain={[this.state.min, this.state.max]}/>
              <Tooltip {...tooltip_options}/>
              {company_list.map(company => (
                <Line legendType="square" name={company} type={curve_type} dataKey={this.data_key_f(company)} stroke={company_colors[company]} key={company} dot={false} activeDot={true} />
              ))}
              { this.props.legend ? <Legend  /> : null }
            </LineChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

TimeRatingChart.contextType = AnalysisContext;

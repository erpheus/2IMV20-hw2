import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid,
  XAxis, YAxis, Tooltip
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class RatingAreaChart extends React.Component {
  render() {
    const { colors, filters, processed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    const rating = this.props.rating;

    return (
      <React.Fragment>
        <Typography variant="h4">{rating}</Typography>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processed_data.avgs_star_list[rating]} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="stars"/>
              <YAxis/>
              <Tooltip/>
              {company_list.map(company => (
                <Area type='monotone' dataKey={company} stroke={company_colors[company]} fill={company_colors[company]} key={company} fillOpacity={0.3}  />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

RatingAreaChart.contextType = AnalysisContext;

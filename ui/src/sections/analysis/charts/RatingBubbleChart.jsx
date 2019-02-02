import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid,
  XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class RatingBubbleChart extends React.Component {
  render() {
    const { colors, filters, processed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    const rating = this.props.rating;

    const scatter_data = [];
    company_list.forEach(c => {scatter_data[c] = []});
    processed_data.avgs_star_list[rating].forEach(star_element => {
      company_list.forEach((company, i) => {
        scatter_data[company].push({stars: star_element.stars, company: i, value: star_element[company]})
      })
    })

    return (
      <React.Fragment>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{top: 60, right: 30, bottom: 0, left: 30}}>
              <XAxis type="number" dataKey="stars" interval={0} domain={[0, 5]} ticks={[...Array(6).keys()]} />
              <YAxis type="number" dataKey="company" name="company" domain={[0, company_list.length-1]} ticks={[...Array(company_list.length).keys()]} tickFormatter={(i) => company_list[i]} padding={{bottom: 20, top: 20}}/>
              <ZAxis type="number" dataKey="value" domain={[0,1]} range={[0,400]}/>
              {company_list.map(company => (
                <Scatter data={scatter_data[company]} key={company} fill={company_colors[company]}/>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

RatingBubbleChart.contextType = AnalysisContext;

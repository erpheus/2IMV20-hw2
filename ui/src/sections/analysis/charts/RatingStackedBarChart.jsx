import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar,
  XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class RatingStackedBarChart extends React.Component {
  render() {
    const { colors, filters, processed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    const rating = this.props.rating;

    const scatter_data = {};
    const all_flat_data = []
    company_list.forEach(c => {scatter_data[c] = {}});
    processed_data.avgs_star_list[rating].forEach(star_element => {
      company_list.forEach((company, i) => {
        const el = {stars: star_element.stars, company: i, [`value-${star_element.stars}-${company}`]: star_element[company]};
        scatter_data[company][star_element.stars] = [el]
        all_flat_data.push(el)
      })
    })

    return (
      <React.Fragment>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={all_flat_data} barGap={-49}>
              <XAxis padding={{left: 30, right: 30}} dataKey="company" allowDuplicatedCategory={true} type="number" domain={[0, company_list.length-1]} ticks={[...Array(company_list.length).keys()]} tickFormatter={(i) => company_list[i]} />
              <YAxis />
              <Tooltip />
              { company_list.map( (company, i) => (
                [1,2,3,4,5].map( stars => (
                  <Bar stackId={i} dataKey={`value-${stars}-${company}`} fill={company_colors[company]} stroke={company_colors[company]} barSize={40} /> 
                )
              )))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

RatingStackedBarChart.contextType = AnalysisContext;

/*

[1,2,3,4,5].map( stars => {
                  <Bar 
                })

                */
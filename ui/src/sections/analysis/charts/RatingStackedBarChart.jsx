import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar,
  XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis
} from 'recharts'

const chart_colors = /*['#bd0026','#f03b20','#fd8d3c','#fecc5c','#ffffb2']['#a63603','#e6550d','#fd8d3c','#fdbe85','#feedde']*/['#a63603','#e6550d','#fd8d3c','#fdae6b','#fdd0a2']

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
    company_list.forEach((company, i) => {
      const el = {company}
      processed_data.avgs_star_list[rating].forEach(star_element => {
        el[""+star_element.stars] = star_element[company]
      })
      all_flat_data.push(el);
    })
    /*processed_data.avgs_star_list[rating].forEach(star_element => {
      const el = {stars: star_element.stars};
      company_list.forEach((company, i) => {
        el[company] = star_element[company]
        //scatter_data[company][star_element.stars] = [el]
        all_flat_data.push(el)
      })
    })*/

    return (
      <React.Fragment>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={all_flat_data} barGap={-49}>
              <XAxis padding={{left: 30, right: 30}} dataKey="company" type="category" />
              <YAxis type="number" domain={[0, 1]} tickFormatter={(value) => Number.isNaN(value) ? '-' : (''+(100*value)).slice(0,4) + '%'}/>
              <Tooltip formatter={(value) => Number.isNaN(value) ? '-' : (''+(100*value)).slice(0,4) + '%'}/>
              {
                [1,2,3,4,5].map( stars => (
                  <Bar key={stars} stackId="stack" dataKey={""+stars} fill={chart_colors[stars-1]} stroke={chart_colors[stars-1]} /> 
                ))
              }
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

              
barSize={40}

                domain={[0, company_list.length-1]} ticks={[...Array(company_list.length).keys()]} tickFormatter={(i) => company_list[i]}*/



import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, Radar, RadarChart, PolarGrid, Legend,
  PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class StarsRadarChart extends React.Component {
  render() {
    const { colors, filters, processed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    return (
      <div style={{margin: '0 auto'}}>
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={processed_data.avgs_list}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            {
              company_list.map(company => (
                <Radar name={company} dataKey={company} stroke={company_colors[company]} fill={company_colors[company]} key={company} fillOpacity={0.3} />
              ))
            }
            <Legend />
            <Tooltip/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

StarsRadarChart.contextType = AnalysisContext;

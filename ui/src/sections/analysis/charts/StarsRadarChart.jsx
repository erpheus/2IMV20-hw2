import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  ResponsiveContainer, Radar, RadarChart, PolarGrid, Legend,
  PolarAngleAxis, PolarRadiusAxis, Tooltip, Text
} from 'recharts'


import { AnalysisContext } from '../AnalysisDataProvider'

export default class StarsRadarChart extends React.Component {
  render() {
    const { colors, filters, processed_data } = this.context;

    const company_list = filters.company;
    const company_colors = colors.companies;

    return (
      <div style={{margin: '0 auto'}}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={processed_data.avgs_list} startAngle={60} endAngle={60 - 360}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="metric"
              tick={(props) => {
                let style = {cursor: 'pointer'}
                const rating = filters.rating[props.index]
                if (this.props.rating == rating) {
                  style = {fontWeight: 'bold', fontSize: '1.3em'};
                }
                return (<Text {...props} style={style} className="recharts-polar-angle-axis-tick-value">{rating}</Text>)
              }}
              onClick={({value}) => this.props.onRatingChange(value)}
            />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            {
              company_list.map(company => (
                <Radar name={company} dataKey={company} stroke={company_colors[company]} fill={company_colors[company]} key={company} fillOpacity={0.3} />
              ))
            }
            <Tooltip/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

StarsRadarChart.contextType = AnalysisContext;

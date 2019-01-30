import React from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import { AnalysisContext } from './AnalysisDataProvider'
import AnalysisCalculator from './AnalysisCalculator'
import StarsRadarChart from './charts/StarsRadarChart'
import RatingAreaChart from './charts/RatingAreaChart'


export default class ReviewComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_filters: null
    }
  }

  filtersUpdate(changed_filters){
    this.setState(s => ({
      ...s,
      new_filters: {
        ...s.new_filters,
        ...changed_filters
      }
    }))
  }

  render() {
    if (!this.context) {
      return (
        <Typography>There's currently no data to be presented, please go to the Home tab to load</Typography>
      )
    }

    let new_context = this.context;
    if (this.state.new_filters !== null) {
      new_context = {
        ...new_context,
        filters: {...new_context.filters, ...this.state.new_filters}
      };
    }

    return (
      <AnalysisContext.Provider value={new_context}>
        <Slider
          value={new_context.filters.time.since}
          min={this.context.filters.time.since}
          max={this.context.filters.time.to}
          onChange={(e, v) => {
            this.filtersUpdate({
              time: {since: v, to: new_context.filters.time.to}
            })
          }}
        />
        <AnalysisCalculator>
          <StarsRadarChart />
          <RatingAreaChart rating="overall-ratings" />
        </AnalysisCalculator>
      </AnalysisContext.Provider>
    )
  }
}

ReviewComparison.contextType = AnalysisContext;

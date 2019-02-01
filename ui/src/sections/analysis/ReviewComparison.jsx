import React from 'react'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { AnalysisContext } from './AnalysisDataProvider'
import AnalysisCalculator from './AnalysisCalculator'
import StarsRadarChart from './charts/StarsRadarChart'
import RatingAreaChart from './charts/RatingAreaChart'
import TimeRatingChart from './charts/TimeRatingChart'
import TimePicker from './charts/TimePicker'


export default class ReviewComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_filters: null,
      rating: 'overall-ratings'
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

  setRating(new_rating){
    this.setState(s => ({...s, rating: new_rating}));
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
        <AnalysisCalculator>
          <TimePicker onRangeChange={(since, to) => this.filtersUpdate({time: {since, to}})} />
          <TimeRatingChart rating={this.state.rating} />
          <Grid container spacing={24} style={{marginTop: 30}}>
            <Grid item xs={12} sm={6}>
              <StarsRadarChart rating={this.state.rating} onRatingChange={this.setRating.bind(this)}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RatingAreaChart rating={this.state.rating} />
            </Grid>
          </Grid>
        </AnalysisCalculator>
      </AnalysisContext.Provider>
    )
  }
}

ReviewComparison.contextType = AnalysisContext;

import React from 'react'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import SettingsIcon from '@material-ui/icons/Settings';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

import { AnalysisContext } from './AnalysisDataProvider'
import AnalysisCalculator from './AnalysisCalculator'
import StarsRadarChart from './charts/StarsRadarChart'
import RatingAreaChart from './charts/RatingAreaChart'
import RatingBubbleChart from './charts/RatingBubbleChart'
import RatingStackedBarChart from './charts/RatingStackedBarChart'
import TimeRatingChart from './charts/TimeRatingChart'
import TimePicker from './charts/TimePicker'

import './charts/charts.css'


const starscharts = {
  'bubble': RatingBubbleChart,
  'area': RatingAreaChart,
  'bar': RatingStackedBarChart
}


export default class ReviewComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_filters: null,
      rating: 'overall-ratings',
      modalOpen: false,
      starschart: 'bubble'
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

    const Starschart = starscharts[this.state.starschart];

    return (
      <div style={{position: 'relative'}}>
        <AnalysisContext.Provider value={new_context}>
          <AnalysisCalculator>
            <TimePicker onRangeChange={(since, to) => this.filtersUpdate({time: {since, to}})} />
            <TimeRatingChart rating={this.state.rating} count legend />
            <Grid container spacing={24} style={{marginTop: 30}}>
              <Grid item xs={12} sm={6}>
                <StarsRadarChart rating={this.state.rating} onRatingChange={this.setRating.bind(this)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Starschart rating={this.state.rating} />
              </Grid>
            </Grid>
            <TimeRatingChart rating={this.state.rating} />
          </AnalysisCalculator>
        </AnalysisContext.Provider>

        <div style={{position: 'absolute', bottom: '100%', left: '100%', cursor: 'pointer'}}>
          <SettingsIcon onClick={() => {this.setState(s => ({...s, modalOpen: true}))}} />
        </div>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={() => {this.setState(s => ({...s, modalOpen: false}))}}
        >
          <Paper style={{position: 'absolute', top: 'calc(50% - 100px)', left: 'calc(50% - 200px)', height: 200, width: 400, padding: 40}}>
            <InputLabel shrink style={{marginRight: 20}}>
              Stars Chart type
            </InputLabel>
            <Select
              value={this.state.starschart}
              onChange={e => {this.setState(s => ({...s, starschart: e.target.value}))}}
              displayEmpty
              name="starschart"
            >
              <MenuItem value={'bubble'}>Bubble Chart</MenuItem>
              <MenuItem value={'area'}>Area Chart</MenuItem>
              <MenuItem value={'bar'}>Stacked bar Chart</MenuItem>
            </Select>
          </Paper>
        </Modal>
      </div>
    )
  }
}

ReviewComparison.contextType = AnalysisContext;

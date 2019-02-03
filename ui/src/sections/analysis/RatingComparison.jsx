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
import Checkbox from '@material-ui/core/Checkbox';
import Joyride from 'react-joyride';

import { AnalysisContext } from './AnalysisDataProvider'
import AnalysisCalculator from './AnalysisCalculator'
import StarsRadarChart from './charts/StarsRadarChart'
import RatingAreaChart from './charts/RatingAreaChart'
import RatingBubbleChart from './charts/RatingBubbleChart'
import RatingStackedBarChart from './charts/RatingStackedBarChart'
import TimeRatingChart from './charts/TimeRatingChart'
import TimePicker from './charts/TimePicker'
import ChartBorder from './charts/ChartBorder'

import './charts/charts.css'


const starscharts = {
  'bubble': RatingBubbleChart,
  'area': RatingAreaChart,
  'bar': RatingStackedBarChart
}


const steps = [
  {
    target: '#timepicker',
    content: "Choose here a time range to observe. The line shown inside indecates the amount of messages over time. If you narrow your search space to the last months you'll probably get more accurate results as there are more answers." ,
  },
  {
    target: '#timechart',
    content: "This chart will display again teh amount of information over time but separated by company."
  },
  {
    target: '#radarchart',
    content: "For the selected time frame the average of each company on each category will be computed and displayed on this chart. Don't forget to click on the rating labels to change the remaining graphs."
  },
  {
    target: '#stardensitychart',
    content: "This chart will show the distribution of stars (what percentage of the ratings given were 5,4,etc...) for each company. There are several alternatives to this chart that can be explored in thids page's settings."
  },
  {
    target: '#timeaverage',
    content: "This last chart can show you the evolution of the average for a given company, over time. Gaps appear where there is no data."
  }
]


export default class ReviewComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_filters: null,
      rating: 'overall-ratings',
      modalOpen: false,
      starschart: 'bar'
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
        <Joyride steps={steps} disableBeacon={true} continuous={true}/>
        <AnalysisContext.Provider value={new_context}>
          <AnalysisCalculator>
            <ChartBorder title="Company filter">
              <div style={{textAlign: 'center'}}>
                {
                  this.context.initial_filters.company.map(company => (
                    <div style={{display: 'inline-block', marginLeft: 10, marginRight: 10}} key={company}>
                      <Checkbox
                        checked={new_context.filters.company.indexOf(company) != -1}
                        onChange={e => {
                          if (!e.target.checked) {
                            this.filtersUpdate({company: new_context.filters.company.filter(c => c != company)}) 
                          } else {
                            this.filtersUpdate({company: new_context.filters.company.concat([company])})
                          }
                        }}
                      />{company}
                    </div>
                  ))
                }
              </div>
            </ChartBorder>
            <ChartBorder title="Time range selector (with #total data entries inside)" id="timepicker">
              <TimePicker onRangeChange={(since, to) => this.filtersUpdate({time: {since, to}})} />
            </ChartBorder>
            <ChartBorder title="#data entries for each company along time" id="timechart">
              <TimeRatingChart rating={this.state.rating} count legend />
            </ChartBorder>
            <Grid container spacing={24} style={{marginTop: 0}}>
              <Grid item sm={12} md={6}>
                <ChartBorder title="Average stars for each company in all ratings" id="radarchart">
                  <StarsRadarChart rating={this.state.rating} onRatingChange={this.setRating.bind(this)}/>
                </ChartBorder>
              </Grid>
              <Grid item sm={12} md={6}>
                <ChartBorder title={`Stars density distribution for selected rating (${this.state.rating})`} id="stardensitychart" >
                  <Starschart rating={this.state.rating} />
                </ChartBorder>
              </Grid>
            </Grid>
            <ChartBorder title={`Average selected rating (${this.state.rating}), for each company, over time`} id="timeaverage">
              <TimeRatingChart rating={this.state.rating} />
            </ChartBorder>
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

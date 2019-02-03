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
import TwoWordColumnsBarChart from './charts/TwoWordColumnsBarChart'
import TimeRatingChart from './charts/TimeRatingChart'
import TimePicker from './charts/TimePicker'
import ChartBorder from './charts/ChartBorder'

import './charts/charts.css'



export default class TextComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_filters: null,
      rating: 'overall-ratings',
      modalOpen: false,
      company_left: '',
      company_right: '',
      text: '',
      tfidfType: 'ngram2'
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

    const is_valid_configuration = this.state.company_left && this.state.company_right && this.state.text;

    let new_context = this.context;
    if (this.state.new_filters !== null) {
      new_context = {
        ...new_context,
        filters: {...new_context.filters, ...this.state.new_filters}
      };
    }

    return (
      <div style={{position: 'relative'}}>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <div style={{marginLeft: 20, marginRight: 20, display: 'inline-block'}}>
            <InputLabel shrink style={{marginRight: 20}}>
                Company on the left
            </InputLabel>
            <Select
              value={this.state.company_left}
              onChange={e => {this.setState(s => ({...s, company_left: e.target.value}))}}
              displayEmpty
            >
              <MenuItem value={''}>None</MenuItem>
              {
                this.context.initial_filters.company.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>    
                ))
              }
            </Select>
          </div>
          <div style={{marginLeft: 20, marginRight: 20, display: 'inline-block'}}>
            <InputLabel shrink style={{marginRight: 20}}>
                Company on the right
            </InputLabel>
            <Select
              value={this.state.company_right}
              onChange={e => {this.setState(s => ({...s, company_right: e.target.value}))}}
              displayEmpty
            >
              <MenuItem value={''}>None</MenuItem>
              {
                this.context.initial_filters.company.filter(company => company != this.state.company_left).map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>    
                ))
              }
            </Select>
          </div>
          <div style={{marginLeft: 20, marginRight: 20, display: 'inline-block'}}>
            <InputLabel shrink style={{marginRight: 20}}>
                Text variable to compare
            </InputLabel>
            <Select
              value={this.state.text}
              onChange={e => {this.setState(s => ({...s, text: e.target.value}))}}
              displayEmpty
            >
              <MenuItem value={''}>None</MenuItem>
              {
                this.context.initial_filters.text.map(v => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>    
                ))
              }
            </Select>
          </div>
        </div>

        {
          is_valid_configuration
            ? (
              <AnalysisContext.Provider value={new_context}>
                <AnalysisCalculator>
                  <ChartBorder title="Time range selector (with #total data entries inside)">
                    <TimePicker onRangeChange={(since, to) => this.filtersUpdate({time: {since, to}})} />
                  </ChartBorder>
                  <ChartBorder title="Word or ngram frequency comparison">
                    <TwoWordColumnsBarChart company_left={this.state.company_left} company_right={this.state.company_right} text={this.state.text} tfidfType={this.state.tfidfType} />
                  </ChartBorder>
                </AnalysisCalculator>
              </AnalysisContext.Provider>
            )
            : (
              <Typography>You must choose two companies and a text variable for this comparison to show.</Typography>
            )
        }

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
            <Typography variant="h5" gutterBottom>Text comparison options</Typography>
            <div style={{marginLeft: 20, marginRight: 20, display: 'inline-block'}}>
              <InputLabel shrink style={{marginRight: 20}}>
                  Tf-idf type
              </InputLabel>
              <Select
                value={this.state.tfidfType}
                onChange={e => {this.setState(s => ({...s, tfidfType: e.target.value}))}}
                displayEmpty
              >
                <MenuItem value={'normal'}>Normal</MenuItem>
                <MenuItem value={'ngram2'}>With 2-grams</MenuItem>
                <MenuItem value={'ngram3'}>With 3-grams</MenuItem>
                <MenuItem value={'ngram4'}>With 4-grams</MenuItem>
              </Select>
            </div>
          </Paper>
        </Modal>
      </div>
    )
  }
}

TextComparison.contextType = AnalysisContext;

import React from 'react'
import Papa from 'papaparse'


export const AnalysisContext = React.createContext(null);
export const AnalysisChoosingContext = React.createContext(null);


export default class AnalysisDataProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csv_data: null,
      state: 'not loaded'
    }
  }

  loadData(dataset) {
    if (dataset == 'full') {
      this.dataDownload('/employee_reviews.csv')
    } else {
      this.dataDownload('/employee_reviews_small.csv')
    }
  }

  dataDownload(url) {
    // Load data
    this.setState((prev_state) => (
      {...prev_state, state: 'downloading'}
    ));
    fetch(url)
      .then(function(response) {
        return response.text();
      })
      .then(myData => {
        this.setState((prev_state) => (
          {...prev_state, state: 'parsing'}
        ));
        Papa.parse(myData, {
          header: true,
          dynamicTyping: true,
          complete: results => {
            results.data.pop(); // Remove empty last row
            results.data = results.data.map(row => ({
              ...row,
              "employee-type": row["job-title"].split(' - ')[0]
            }));
            this.setState((prev_state) => (
              {...prev_state, 'csv_data': results.data, state: 'ready'}
            ));
          }
        });
      });
  }

  render() {
    const data_provider = {
      loadData: this.loadData.bind(this),
      state: this.state.state
    };
    return (
      <AnalysisContext.Provider value={this.state.csv_data}>
        <AnalysisChoosingContext.Provider value={data_provider}>
          {this.props.children}
        </AnalysisChoosingContext.Provider>
      </AnalysisContext.Provider>
    )
  }
}
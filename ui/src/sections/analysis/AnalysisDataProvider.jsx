import React from 'react'
import Papa from 'papaparse'


export const AnalysisContext = React.createContext(null);


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
          complete: results => {
            results.data.pop(); // Remove empty last row
            this.setState((prev_state) => (
              {...prev_state, 'csv_data': results.data, state: 'ready'}
            ));
          }
        });
      });
  }

  render() {
    return (
      <div>
        <h3>Load analysis data</h3>
        <button onClick={() => {this.loadData('small')}}>
          Load small dataset
        </button>
        <button onClick={() => {this.loadData('full')}}>
          Load full dataset
        </button>
        <p>State: {this.state.state}</p>
        <hr />
        <AnalysisContext.Provider value={this.state.csv_data}>
          {this.props.children}
        </AnalysisContext.Provider>
      </div>
    )
  }
}
import React from 'react'
import Papa from 'papaparse'


export const AnalysisContext = React.createContext(null);
export const AnalysisChoosingContext = React.createContext(null);


const CompanyColors = {
  facebook: '#225ebf',
  amazon: '#ffdd49',
  netflix: '#f44522',
  google: '#449b39',
  microsoft: '#6dffe4',
  apple: '#f740d2'
}


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
        this.parseResults(myData)
      });
  }

  parseResults(result_str_data) {
    setTimeout(() => {
      Papa.parse(result_str_data, {
        header: true,
        dynamicTyping: true,
        complete: results => this.enhanceResults(results.data)
      });
    }, 50) // Let some time to update to parsing
  }

  enhanceResults(result_data) {
    result_data.pop(); // Remove empty last row
    result_data = result_data.map(row => ({
      ...row,
      "employee-type": row["job-title"].split(' - ')[0],
      "time": Date.parse(row["dates"])
    }));
    const times = result_data
      .map(e => e.time)
      .filter(e => e != "none" && !isNaN(e) && e !== null && e !== undefined);
    const initial_filters = {
      time: {
        since: times.reduce((v1, v2) => Math.min(v1, v2)),
        to: times.reduce((v1, v2) => Math.max(v1, v2))
      },
      company: [...new Set(result_data.map(r => r["company"]))],
      rating: [
        "overall-ratings",
        "work-balance-stars",
        "culture-values-stars",
        "carrer-opportunities-stars",
        "comp-benefit-stars",
        "senior-mangemnet-stars"
      ]
    };
    this.setState((prev_state) => ({
      ...prev_state,
      'context_data': {
        raw_data: result_data,
        colors: {companies: CompanyColors},
        filters: initial_filters,
        initial_filters
      },
      state: 'ready'
    }));
  }

  render() {
    const data_provider = {
      loadData: this.loadData.bind(this),
      state: this.state.state
    };
    return (
      <AnalysisContext.Provider value={this.state.context_data}>
        <AnalysisChoosingContext.Provider value={data_provider}>
          {this.props.children}
        </AnalysisChoosingContext.Provider>
      </AnalysisContext.Provider>
    )
  }
}
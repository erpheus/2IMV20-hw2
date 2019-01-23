import React from 'react'
import Papa from 'papaparse'


export default class Analysis1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {csv_data: null}
  }

  componentDidMount() {
    // Load data
    fetch('/employee_reviews.csv')
      .then(function(response) {
        return response.text();
      })
      .then(myData => {
        Papa.parse(myData, {
          complete: results => {
            this.setState({'csv_data': results.data});
          }
        });
      });
  }

  render() {
    if (!this.state.csv_data) {
      return <p>Loading data</p>
    }

    return (
      <div>
        <p>data</p>
        <p>Number of rows: {this.state.csv_data.length}</p>
        <p>First row: {this.state.csv_data[0].join(', ')}</p>
        <p>Second row: {this.state.csv_data[1].join(', ')}</p>
      </div>
    )
  }
}
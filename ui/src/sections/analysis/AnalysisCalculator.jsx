import React from 'react'
import memoize from "memoize-one";

import { AnalysisContext } from './AnalysisDataProvider'

function yearMonthOfDate(date) {
  const d = Date(date);
  return `${("0"+(d.getMonth()+1)).slice(-2)}-${d.getFullYear()}`;
}

export default class AnalysisCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
    this.compartimentalize = memoize(this.compartimentalize);
  }

  compartimentalize(csv_data) {
    
  }

  averages() {
    const csv_data = this.context.raw_data;
    const variables = this.context.filters.rating;
    const companies = this.context.filters.company;
    const time = this.context.filters.time;

    const group_variable = "company"
    const groups = companies;
    const avgs = {};



    variables.forEach(vname => {
      avgs[vname] = {}
      groups.forEach(gname => {
        avgs[vname][gname] = 0;
        avgs[vname][`${gname}_count`] = 0;
        [0,1,2,3,4,5].forEach(i => {
          avgs[vname][`${gname}_${i}`] = 0;
        });
      })
    });

    for (var i = 0; i < csv_data.length; i++) {
      if (csv_data[i].time < time.since || csv_data[i].time > time.to) {
        continue
      }

      variables.forEach(vname => {
        if (csv_data[i][vname] !== null && csv_data[i][vname] !== undefined && csv_data[i][vname] !== "none") {
          avgs[vname][csv_data[i][group_variable]] += csv_data[i][vname];
          avgs[vname][`${csv_data[i][group_variable]}_count`] += 1;
          avgs[vname][`${csv_data[i][group_variable]}_${Math.round(csv_data[i][vname])}`] += 1;
        }
      })
    }
    const avgs_list = []
    const avgs_star_list = {}
    variables.forEach(vname => {
      let list_element = {"metric": vname}
      avgs_star_list[vname] = []
      groups.forEach(gname => {
        avgs[vname][gname] = avgs[vname][gname] / avgs[vname][`${gname}_count`];
        list_element[gname] = avgs[vname][gname];
      });
      [0,1,2,3,4,5].forEach(i => {
        let list_element = {stars: i};
        groups.forEach(gname => {
          avgs[vname][`${gname}_${i}`] = avgs[vname][`${gname}_${i}`] / avgs[vname][`${gname}_count`];
          list_element[gname] = avgs[vname][`${gname}_${i}`];
        });
        avgs_star_list[vname].push(list_element);
      })
      avgs_list.push(list_element);
    });
    return {avgs, avgs_list, avgs_star_list}
  }

  render() {
    let src_data = this.context;
    if (!src_data) {
      return (
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      )
    }

    const processed_data = this.averages();

    return (
      <AnalysisContext.Provider value={{...src_data, processed_data}}>
        {this.props.children}
      </AnalysisContext.Provider>
    )
  }
}

AnalysisCalculator.contextType = AnalysisContext;

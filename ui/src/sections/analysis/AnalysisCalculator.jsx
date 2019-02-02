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
    this.allTimedData = memoize(this.allTimedData);
  }

  compartimentalize(csv_data, filters) {
    const time = filters.time;
    const timeparts = {};
    this.timekeyssinceto(time.since, time.to).forEach(k => {timeparts[k] = []});
    for (var i = 0; i < csv_data.length; i++) {
      if (!csv_data[i].time || csv_data[i].time == "none" || csv_data[i].time < 1170275476000) {
        continue
      }
      timeparts[this.timekeyfor(csv_data[i].time)].push(csv_data[i]);
    }
    Object.keys(timeparts).map((tpk, i) => {
      timeparts[tpk] = {time: tpk, ...this.averages(timeparts[tpk], filters)};
    });
    return timeparts;
  }

  timekeyssinceto(since, to) {
    const timekeys = [];
    const src_d = new Date(since);
    const dst_d = new Date(to);
    for (let y = src_d.getFullYear(); y <= dst_d.getFullYear(); y++) {
      const minMonth = y == src_d.getFullYear() ? src_d.getMonth() : 0;
      const maxMonth = y == dst_d.getFullYear() ? dst_d.getMonth() : 11;
      for (let m = minMonth; m <= maxMonth; m++) {
        timekeys.push(`${y}-${('0' + (m+1)).slice(-2)}`);
      }
    }
    return timekeys;
  }

  timekeyfor(intdate) {
    const d = new Date(intdate);
    return `${d.getFullYear()}-${('0' + (d.getMonth()+1)).slice(-2)}`;
  }

  averages(csv_data, filters) {
    const variables = filters.rating;
    const companies = filters.company;

    const group_variable = "company"
    const groups = companies;
    const avgs = {};

    variables.forEach(vname => {
      avgs[vname] = {total_count: 0}
      groups.forEach(gname => {
        avgs[vname][gname] = 0;
        avgs[vname][`${gname}_count`] = 0;
        [0,1,2,3,4,5].forEach(i => {
          avgs[vname][`${gname}_${i}`] = 0;
        });
      })
    });

    let total_count = 0;
    for (var i = 0; i < csv_data.length; i++) {
      let at_least_one = false;
      variables.forEach(vname => {
        if (csv_data[i][vname] !== null && csv_data[i][vname] !== undefined && csv_data[i][vname] !== "none") {
          avgs[vname].total_count += 1;
          at_least_one = true;
          avgs[vname][csv_data[i][group_variable]] += csv_data[i][vname];
          avgs[vname][`${csv_data[i][group_variable]}_count`] += 1;
          avgs[vname][`${csv_data[i][group_variable]}_${Math.round(csv_data[i][vname])}`] += 1;
        }
        if (at_least_one) {total_count += 1}
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
    return {avgs, avgs_list, avgs_star_list, total_count}
  }

  filterAverages(timeparts, filters) {
    const res = {};
    this.timekeyssinceto(filters.time.since, filters.time.to).forEach(k => {
      res[k] = timeparts[k];
    });
    return res;
  }

  joinAverages(timeparts, filters) {
    return Object.keys(timeparts).map(k => timeparts[k]).reduce((t1, t2) => this.joinTwoAverages(t1, t2, filters));
    return this.joinTwoAverages(
      timeparts[Object.keys(timeparts)[0]],
      timeparts[Object.keys(timeparts)[0]],
      filters
    )
  }

  joinTwoAverages(avgs1, avgs2, filters) {
    const res = {avgs: {}, avgs_list: [], avgs_star_list: {}}
    const companycounts = {};
    filters.rating.forEach(rating => {
      const avgs_rating = {};
      const avgs_list_rating = {metric: rating};
      const avgs_star_list_rating = [];

      [0,1,2,3,4,5].forEach(i => {avgs_star_list_rating.push({stars: i})});

      filters.company.map(company => {
        const count1 = avgs1.avgs[rating][`${company}_count`];
        const count2 = avgs2.avgs[rating][`${company}_count`];

        avgs_rating[`${company}_count`] = count1 + count2;
        avgs_rating[company] = count1 > 0 ? avgs1.avgs[rating][company] * count1 : 0 
        avgs_rating[company] += count2 > 0 ? avgs2.avgs[rating][company] * count2 : 0
        avgs_rating[company] = (count1 + count2) > 0 ? avgs_rating[company] / (count1 + count2) : NaN;

        avgs_list_rating[company] = avgs_rating[company];

        [0,1,2,3,4,5].forEach(i => {
          avgs_rating[`${company}_${i}`] = count1 > 0 ? avgs1.avgs[rating][`${company}_${i}`] * count1 : 0 
          avgs_rating[`${company}_${i}`] += count2 > 0 ? avgs2.avgs[rating][`${company}_${i}`] * count2 : 0
          avgs_rating[`${company}_${i}`] = (count1 + count2) > 0 ? avgs_rating[`${company}_${i}`] / (count1 + count2) : NaN;

          avgs_star_list_rating[i][company] = avgs_rating[`${company}_${i}`];
        });

      });

      res.avgs[rating] = avgs_rating;
      res.avgs_list.push(avgs_list_rating)
      res.avgs_star_list[rating] = avgs_star_list_rating;
    })
    return res;
  }

  allTimedData(compartimentalized) {
    return Object.keys(compartimentalized).sort().map(k => compartimentalized[k]);
  }

  visualizedData() {
    let res = this.context.raw_data;
    res = this.compartimentalize(res, this.context.initial_filters);
    const all_timed_data = this.allTimedData(res);
    res = this.filterAverages(res, this.context.filters);
    const timed_data = Object.keys(res).sort().map(k => res[k]);
    res = this.joinAverages(res, this.context.filters);
    return {processed_data: res, timed_data, all_timed_data};
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

    const extra_data = this.visualizedData();

    return (
      <AnalysisContext.Provider value={{...src_data, ...extra_data}}>
        {this.props.children}
      </AnalysisContext.Provider>
    )
  }
}

AnalysisCalculator.contextType = AnalysisContext;

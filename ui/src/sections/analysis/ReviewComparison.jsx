import React from 'react'
import Papa from 'papaparse'
import {Radar, RadarChart, PolarGrid, Legend,
         PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts'


import { AnalysisContext } from './AnalysisDataProvider'


const CompanyColors = {
  facebook: '#225ebf',
  amazon: '#ffdd49',
  netflix: '#f44522',
  google: '#449b39',
  microsoft: '#6dffe4',
  apple: '#f740d2'
}


export default class ReviewComparison extends React.Component {

  averages() {
    let csv_data = this.context;
    let variables = [
      "overall-ratings",
      "work-balance-stars",
      "culture-values-stars",
      "carrer-opportunities-stars",
      "comp-benefit-stars",
      "senior-mangemnet-stars"
    ]
    let group_variable = "company"
    let companies = [...new Set(csv_data.map(r => (r[group_variable])))];
    let groups = companies;
    let avgs = {};
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
    let csv_data = this.context;
    if (!csv_data) {
      return <p>No data</p>
    }

    const { avgs, avgs_list, avgs_star_list } = this.averages();

    return (
      <div>
        <p>data</p>
        <p>Number of rows: {csv_data.length}</p>
        <p>Averages: {JSON.stringify(avgs_list)}</p>
        <hr />
        <RadarChart outerRadius={250} width={730} height={800} data={avgs_list}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          {
            Object.keys(CompanyColors).map(company => (
              <Radar name={company} dataKey={company} stroke={CompanyColors[company]} fill={CompanyColors[company]} key={company} fillOpacity={0.3} />
            ))
          }
          <Legend />
          <Tooltip/>
        </RadarChart>
        <hr />
        {
          Object.keys(avgs_star_list).map(rating => {
            return (
            <div key={rating}>
              <h4>{rating}</h4>
              <AreaChart width={600} height={400} data={avgs_star_list[rating]} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="stars"/>
                <YAxis/>
                <Tooltip/>
                {
                  Object.keys(CompanyColors).map(company => (
                    <Area type='monotone' dataKey={company} stroke={CompanyColors[company]} fill={CompanyColors[company]} key={company} fillOpacity={0.3}  />
                  ))
                }
              </AreaChart>
            </div>
          )})
        }
      </div>
    )
  }
}

ReviewComparison.contextType = AnalysisContext;

import React from 'react'
import Typography from '@material-ui/core/Typography';
import {
  BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {TfIdf, NGrams, SentenceTokenizer, OrthographyTokenizer} from 'natural'


import { AnalysisContext } from '../AnalysisDataProvider'
import ChartBorder from './ChartBorder'


const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]

export default class TwoWordColumnsBarChart extends React.Component {
  constructor(props, context) {
    super(props);
    this.stopwords = stopwords.concat([...context.filters.company, "none"])
  }

  tfidf(type, doc_1, doc_2, company_1, company_2) {

    type = type || 'normal';

    let tfidf_res;
    if (type == 'normal') {
      tfidf_res = this.normalTfidf(doc_1, doc_2);
    } else {
      const ngrams = parseInt(type.slice(5))
      tfidf_res = this.nGramTfidf(doc_1, doc_2, ngrams);
    }

    const { terms_1, terms_2 } = tfidf_res;

    const ratio = doc_1.length / doc_2.length;

    const col_left = []
    const col_right = []
    const data = []

    let total = 0;
    let i = 0;
    let j = 0;
    let max_value = 0;
    while(total < 20) {
      if (terms_1[i] === undefined || terms_2[j] === undefined) {
        break;
      }
      if (this.stopwords.indexOf(terms_1[i].term) != -1 ) {
        i++;
        continue;
      }
      if (this.stopwords.indexOf(terms_2[j].term) != -1 ) {
        j++;
        continue;
      }
      max_value = Math.max(max_value, terms_1[i].tfidf/ratio, terms_2[j].tfidf);
      data.push({name: total, [company_1]: -terms_1[i].tfidf/ratio, [company_2]: terms_2[j].tfidf})
      col_left.push(terms_1[i].term);
      col_right.push(terms_2[j].term);
      i++;
      j++;
      total++;
    }

    return {data, col_left, col_right, total, max_value}

  }


  normalTfidf(doc_1, doc_2) {
    const tfidf = new TfIdf();

    tfidf.addDocument(doc_1)
    tfidf.addDocument(doc_2)

    return {terms_1: tfidf.listTerms(0), terms_2: tfidf.listTerms(1)};
  }

  ngrams_for_doc(doc, ngrams) {
    const tok = new SentenceTokenizer();
    const ort_tok = new OrthographyTokenizer({language: 'en'});
    const res = [];
    doc.split('\n').forEach(line => {
      if (line && line != "none" && line !== null) {
        tok.tokenize(line + '\n\n').forEach(sentence => {
          const clean_sentence = ort_tok.tokenize(sentence).filter(gram => this.stopwords.indexOf(gram) == -1).join(' ');
          NGrams.ngrams(clean_sentence, ngrams).forEach(ngram => {
            const filtered_ngram = ngram.filter(gram => this.stopwords.indexOf(gram) == -1).join(' ');
            if (filtered_ngram){res.push(filtered_ngram);}
          })
        })
      }
    });
    return res;
  }

  nGramTfidf(doc_1, doc_2, ngrams) {
    const tfidf = new TfIdf();

    tfidf.addDocument(this.ngrams_for_doc(doc_1, ngrams));
    tfidf.addDocument(this.ngrams_for_doc(doc_2, ngrams));

    let terms_1 = tfidf.listTerms(0);
    let terms_2 = tfidf.listTerms(1);

    terms_1.forEach(t => { t.tfidf = t.tf * t.idf });
    terms_1.sort((a,b) => (b.tfidf - a.tfidf))

    terms_2.forEach(t => { t.tfidf = t.tf * t.idf });
    terms_2.sort((a,b) => (b.tfidf - a.tfidf))

    return {terms_1, terms_2};
  }


  render() {
    const { colors, filters, processed_data } = this.context;

    const text_v = this.props.text;
    const company_1 = this.props.company_left;
    const company_2 = this.props.company_right;

    const doc_1 = processed_data.text[text_v][company_1].toLowerCase();
    const doc_2 = processed_data.text[text_v][company_2].toLowerCase();

    const {data, col_left, col_right, total, max_value} = this.tfidf(this.props.tfidfType, doc_1, doc_2, company_1, company_2)

    const max_term_left_length = Math.max(...col_left.map(t => t.length))
    const max_term_right_length = Math.max(...col_right.map(t => t.length))

    const soft_max_value = Math.max(1, Math.ceil(max_value * 1.1));

    return (
      <React.Fragment>
        <div style={{textAlign: 'center', margin: 30}}>
          <div style={{display: 'inline-block', textAlign: 'right', paddingRight: 100}}>
            <Typography variant="h4">{company_1}</Typography>
          </div>
          <div style={{display: 'inline-block', textAlign: 'left', paddingLeft: 100}}>
            <Typography variant="h4">{company_2}</Typography>
          </div>
        </div>
        <div style={{margin: '0 auto'}}>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={data} stackOffset="sign"
            margin={{top: 5, right: 30, left: 20, bottom: 5}} layout="vertical">
             <CartesianGrid strokeDasharray="3 3" vertical={false}/>
             <XAxis type="number" domain={[-soft_max_value,soft_max_value]}/>
             <YAxis dataKey="name" width={max_term_left_length*8} type="category" tickFormatter={v => col_left[v]} ticks={[...Array(data.length).keys()]} />
             <YAxis dataKey="name" width={max_term_right_length*8} type="category" yAxisId="right" orientation="right" tickFormatter={v => col_right[v]} ticks={[...Array(data.length).keys()]}/>
             
             <ReferenceLine x={0} stroke='#000'/>
             <Bar dataKey={company_1} fill={colors.companies[company_1]} stackId="stack" />
             <Bar dataKey={company_2} fill={colors.companies[company_2]} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </React.Fragment>
    )
  }
}

TwoWordColumnsBarChart.contextType = AnalysisContext;

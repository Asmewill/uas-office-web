/**
 * Created by hujs on 2020/11/24
 * Desc: 图表集合
 */

import React, { Component } from 'react'
import BarGraph from './BarGraph'
import LineChart from './LineChart'
import PieChart from './PieChart'
import TableChart from './TableChart'
import SumChart from './SumChart'
import LazyLoad from 'react-lazyload'
import { forceCheck } from 'react-lazyload'

export default class CommonCharts extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    //BarGraph柱状 LineChart折线 PieChart圆饼 TableChart表格
    let { chartData: { TYPE_ }, setOverflow, needSum } = this.props
    let chartItem = null
    switch (TYPE_) {
      case 'column':
        chartItem = <BarGraph chartData={this.props.chartData}/>
        break
      case 'line':
        chartItem = <LineChart chartData={this.props.chartData}/>
        break
      case 'pie':
        chartItem = <PieChart chartData={this.props.chartData}/>
        break
      case 'list':
        chartItem = <TableChart chartData={this.props.chartData}/>
        break
      case 'sum':
        if (needSum) {
          chartItem = <SumChart chartData={this.props.chartData}/>
        } else {
          chartItem = null
        }
        break
      default:
        chartItem = null
        break
    }
    return (
      <div className='common-charts' style={{ marginBottom: '8px' }}>
        <LazyLoad
          once
          height={80}
          resize={true}
          overflow={setOverflow}
        >
          {chartItem}
        </LazyLoad>
      </div>
    )
  }

}

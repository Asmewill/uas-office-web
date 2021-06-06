/**
 * Created by hujs on 2020/11/12
 * Desc: 折线图
 */

import React, { Component } from 'react'
import { Chart, Line, Point, Tooltip, Axis, Geom } from 'bizcharts'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'

export default class LineChart extends Component {

  constructor () {
    super()

    this.state = {
      detailData: [],
    }
  }

  componentDidMount () {
    this.getChartData()
  }

  componentWillUnmount () {

  }

  render () {
    let { chartData: { SONTITLE_, FORMULA_VALUEDISPLAY_, FORMULA_KEYDISPLAY_, FORMULA_UNIT_ } } = this.props
    let data = []
    let { detailData } = this.state
    if (!isObjEmpty(detailData)) {
      data = this.formatData(JSON.parse(detailData))
    }
    return (
      <div className='charts-line' style={{ width: '100%', backgroundColor: '#fff' }}>
        <div className="ant-table-title">{SONTITLE_}</div>
        <div
          className="ant-table-title-second">{FORMULA_KEYDISPLAY_ ? FORMULA_KEYDISPLAY_ : ''}{FORMULA_VALUEDISPLAY_} {'单位(' + FORMULA_UNIT_ + ')'}</div>
        <Chart
          padding={[10, 20, 30, 40]}
          autoFit
          height={240}
          data={data}
          scale={{ value: { min: 0 } }}
        >
          <Line position="xField*yField"/>
          <Point position="xField*yField"/>
          <Geom type="line" tooltip={['yField*xField', (value, name) => {
            return {
              name: `${name}`,
              value,
            }
          }]} position="xField*yField"/>
          <Tooltip showTitle={false}/>
        </Chart>
      </div>
    )
  }

  onShowTooltip = (ev) => {
    const items = ev.items
    items[0].name = null
    items[0].name = items[0].title
    items[0].value = `${items[0].value + this.props.chartData.unit}`
  }

  formatData = (data) => {
    data = data.map(function (item, index, arr) {
      item.yField = Number(item.yField)
      return item
    })
    return data
  }

  getChartData = () => {
    let { chartData: { INSTANCE_ID_, FORMULA_ID_ } } = this.props
    fetchPostObj(API.COMMON_GETSUBSDATA, {
      INSTANCE_ID_: INSTANCE_ID_,
      FORMULA_ID_: FORMULA_ID_,
    }).then(response => {
      this.setState({
        detailData: response.data.list[0].DATA_,
      })
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('图表数据获取失败')
      }
    })
  }

}

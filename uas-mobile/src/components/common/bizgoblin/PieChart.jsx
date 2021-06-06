/**
 * Created by hujs on 2020/11/12
 * Desc: 圆饼图
 */

import React, { Component } from 'react'
import {
  getFloat,
  isObjEmpty,
  isObjNull,
} from '../../../utils/common/common.util'
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
} from 'bizcharts'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { message } from 'antd'

export default class PieChart extends Component {

  constructor () {
    super()

    this.state = {}
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

    const cols = {
      percent: {
        formatter: val => {
          val = getFloat(val * 100, 4) + '%'
          return val
        },
      },
    }

    return (
      <div className='charts-line'
           style={{ width: '100%', backgroundColor: '#fff' }}>
        <div className="ant-table-title">{SONTITLE_}</div>
        <div
          className="ant-table-title-second">{FORMULA_KEYDISPLAY_
          ? FORMULA_KEYDISPLAY_
          : ''}{FORMULA_VALUEDISPLAY_} {(!isObjNull(FORMULA_UNIT_) &&
          FORMULA_UNIT_ !==
          'null') &&
        ('单位(' + FORMULA_UNIT_ + ')')}</div>
        <Chart padding={[25, 25, 25, 25]} height={300} data={data} scale={cols}
               autoFit>
          <Coordinate type="theta" radius={0.75}/>
          <Tooltip showTitle={false}/>
          <Axis visible={false}/>
          <Interval
            animate={false}
            position="percent"
            adjust="stack"
            color="xField"
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            label={[
              '*', {
                content: (data) => {
                  return `${data.xField}: ${getFloat(data.percent * 100, 4)}%`
                },
              }]}
            tooltip={[
              'yField*xField',
              (value, name) => {
                return {
                  name: `${name}`,
                  value,
                }
              },
            ]}
          />
        </Chart>
      </div>
    )
  }

  formatData = (data) => {
    //取得总数
    let ageSum = data.reduce((ageSum, item) => {
      return ageSum + Number(item.yField)
    }, 0)
    ageSum = Math.round(ageSum * 100) / 100

    //取得百分比数
    data = data.map(function (item, index, arr) {
      if (item.yField == '0') {
        item.percent = 0
      } else {
        item.percent = getFloat((Number(item.yField) / ageSum), 4)
      }
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

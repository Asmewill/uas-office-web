/**
 * Created by hujs on 2020/11/12
 * Desc: 柱状图
 */

import React, { Component } from 'react'
import { Chart, Interval, Axis, Tooltip, Geom } from 'bizcharts'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'

export default class BarGraph extends Component {

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
      <div className='bar-graph'
           style={{ width: '100%', backgroundColor: '#fff' }}>
        <div className="ant-table-title">{SONTITLE_}</div>
        <div
          className="ant-table-title-second">{FORMULA_KEYDISPLAY_
          ? FORMULA_KEYDISPLAY_
          : ''}{FORMULA_VALUEDISPLAY_} {'单位(' + FORMULA_UNIT_ + ')'}</div>
        <Chart
          theme={{ maxColumnWidth: 20 }}
          padding={[25, 15, 40, 50]}
          height={300}
          autoFit
          data={data}
        >
          <Axis name='xField'
                label={{
                  rotate: -126,
                  autoRotate: false,
                  offset: 15,
                  textStyle: {
                    textAlign: 'start',
                    fill: '#333333', // 文本的颜色
                    fontSize: 12, // 文本大小
                    textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
                  },
                }}
          />
          <Interval
            position="xField*yField"
            label={[
              'yField',
              (val) => {
                return {
                  content: val,
                  style: {
                    fill: '#333333',
                    fontSize: 12,
                    fontWeight: 'bold',
                  },
                }
              },
            ]}
            tooltip={[
              'yField*xField',
              (value, name) => {
                return {
                  name: `${name}`,
                  value,
                }
              },
            ]}/>
          <Tooltip showTitle={false}/>
        </Chart>
      </div>
    )
  }

  formatData = (data) => {
    data = data.map(function (item, index, arr) {
      item.yField = Number(item.yField)
      return item
    })
    data.reverse()
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

/**
 * Created by hujs on 2020/12/24
 * Desc: 汇总信息
 */

import React, { Component } from 'react'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'
import './bizcharts.less'

export default class SumChart extends Component {

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
    let { detailData: { DATA_, SONTITLE_ } } = this.state

    return (
      <div className='charts-line' style={{ width: '100%', backgroundColor: '#fff' }}>
        <div className="ant-table-title">
          <span className='sum_title'>{SONTITLE_}：</span>
          <span className='sum-detail'>{DATA_}</span>
        </div>
      </div>
    )
  }

  getChartData = () => {
    let { chartData: { INSTANCE_ID_, FORMULA_ID_ } } = this.props
    fetchPostObj(API.COMMON_GETSUBSDATA, {
      INSTANCE_ID_: INSTANCE_ID_,
      FORMULA_ID_: FORMULA_ID_,
    }).then(response => {
      this.setState({
        detailData: response.data.list[0],
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

/**
 * Created by Hujs on 2020/11/26
 * Desc: 数据看板
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommonCharts from '../../../components/common/bizgoblin/CommonCharts'
import { isObjEmpty, isObjNull } from '../../../utils/common/common.util'
import { fetchGet } from '../../../utils/common/fetchRequest'
import { saveChartState } from '../../../redux/actions/chartState'
import { API } from '../../../configs/api.config'
import { message, Empty } from 'antd'

class KanBan extends Component {

  constructor () {
    super()

    this.state = {
      subsData: undefined,
    }
  }

  componentDidMount () {
    this.getChartData()

  }

  componentWillUnmount () {

  }

  render () {
    const chartItem = []
    const { subsData } = this.state

    if (subsData != undefined && subsData.length > 0) {
      subsData.forEach((item, index) => {
        if (!isObjEmpty(item)) {
          chartItem.push(
            <CommonCharts chartData={item} key={index} setOverflow={true}
                          needSum={false}/>,
          )
        }
      })
    }

    if (subsData != undefined && subsData.length == 0) {
      chartItem.push(
        this.getNoneElement(),
      )
    }

    return (
      <>
        {chartItem}
      </>
    )
  }

  getChartData = () => {
    fetchGet(API.COMMON_GETSUBSTYPE)
      .then(response => {
        this.setState({
          subsData: response.data.list,
        })
      }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('图表数据获取失败')
      }
    })
  }

  getNoneElement = () => {
    return (
      <Empty
        key='empty-box'
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span>暂无数据，<span style={{ color: '#47a3ff' }}
                                      onClick={this.addChart}>立即添加</span></span>}
      />
    )
  }

  addChart = () => {
    this.props.KanbanManage()
  }

}

let mapStateToProps = (state) => ({
  chartState: state.chartState,
})

export default connect(mapStateToProps)(KanBan)

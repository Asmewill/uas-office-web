/**
 * Created by Hujs on 2020/12/23
 * Desc: 订阅图表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommonCharts from '../../../components/common/bizgoblin/CommonCharts'
import { isObjEmpty } from '../../../utils/common/common.util'
import { fetchGet, fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { message } from 'antd'

class SubscribeChart extends Component {

  constructor () {
    super()

    this.state = {
      subsData: [],
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

    subsData.forEach((item, index) => {
      if (!isObjEmpty(item)) {
        chartItem.push(
          <CommonCharts chartData={item} key={index} setOverflow={false} needSum={true}/>,
        )
      }
    })

    return (
      <div style={{ background: '#f5f5f9' }}>
        {chartItem}
      </div>
    )
  }

  getChartData = () => {
    let { id, num_id, ins_id } = this.props.match.params
    fetchPostObj(API.SUBSCRIBE_GETCHARTTYPE, {
      ID_: id,
      NUM_ID_: num_id,
      INSTANCE_ID_: ins_id,
    }).then(response => {
      this.setState({
        subsData: response.data.list,
      })
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('图表类型获取失败')
      }
    })
  }

}

let mapStateToProps = (state) => ({
  chartState: state.chartState,
})

export default connect(mapStateToProps)(SubscribeChart)

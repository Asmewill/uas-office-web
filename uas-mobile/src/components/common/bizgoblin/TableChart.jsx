/**
 * Created by hujs on 2020/11/11
 * Desc: GridTable
 */

import React, { Component } from 'react'
import { Table, message } from 'antd'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { isObjEmpty } from '../../../utils/common/common.util'

export default class TableChart extends Component {

  constructor () {
    super()

    this.state = {
      detailData: [],
      detailColumn: [],
      loading: true,
    }
  }

  componentDidMount () {
    this.getChartData()
  }

  componentWillUnmount () {

  }

  render () {
    let { chartData: { SONTITLE_ } } = this.props
    let data = []
    let columns = []
    let { detailData, detailColumn, loading } = this.state
    if (!isObjEmpty(detailData) || !isObjEmpty(detailColumn)) {
      let obj = this.formatData(detailData, detailColumn)
      columns = obj.columns
      data = obj.data
    }

    let height = ''
    if (detailData.length == 0) {
      height = '320px'
    } else {
      height = detailData.length * 100 + 'px'
    }

    return (
      <div className='table-charts' style={{ width: '100%', overflowY: 'auto', background: '#fff' }}>
        <Table
          scroll={{ x: '100%' }}
          style={{ height: height, maxHeight: '320px' }}
          title={() => SONTITLE_}
          pagination={false}
          bordered={true}
          columns={columns}
          dataSource={data}
          size="small"
          tableLayout='fixed'
          sticky={true}  //固定表头
          loading={loading}
        />
      </div>
    )
  }

  formatData = (data, formulaDets) => {
    let columns = formulaDets.map(item => ({
      title: item.description_,
      dataIndex: item.field_,
      key: item.field_,
      width: item.width_,
    }))
    data = data.map(function (item, index, arr) {
      item.key = index
      return item
    })
    let obj = {
      data: data,
      columns: columns,
    }
    return obj
  }

  getChartData = () => {
    let { chartData: { INSTANCE_ID_, FORMULA_ID_ } } = this.props
    fetchPostObj(API.COMMON_GETSUBSDATA, {
      INSTANCE_ID_: INSTANCE_ID_,
      FORMULA_ID_: FORMULA_ID_,
    }).then(response => {
      this.setState({
        detailData: response.data.list[0].DATA_,
        detailColumn: response.data.list[0].formulaDets,
        loading: false,
      })
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('图表数据获取失败')
      }
      this.setState({
        loading: false,
      })
    })
  }
}

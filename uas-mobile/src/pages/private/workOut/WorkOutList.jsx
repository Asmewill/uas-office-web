/**
 * Created by RaoMeng on 2021/4/12
 * Desc: 外勤计划列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyList from '../../../components/common/currencyList/CurrencyList'
import { API } from '../../../configs/api.config'

class WorkOutList extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = '外勤计划'
  }

  componentWillUnmount () {
    this.caller = this.props.match.params.caller
    this.readOnly = this.props.match.params.readOnly
  }

  render () {
    return (
      <CurrencyList
        onRef={el => this.cl = el}
        tabUrl={API.SERVICES_GETORDERTAB}
        listUrl={API.SETVICES_GETORDERLIST}
        onItemClick={this.onItemClick.bind(this)}
        onDocAdd={this.onDocAdd.bind(this)}
        params={{
          caller: this.props.match.params.caller,
          id: 0,
        }}
        addAble={this.props.match.params.readOnly === 'false'}
      />
    )
  }

  /**
   * 列表点击事件
   */
  onItemClick = (rowData) => {
    this.props.history.push(
      '/workOutDetail/' + rowData.id + '/' + this.props.match.params.caller)
  }

  /**
   * 单据新增
   */
  onDocAdd = () => {
    this.props.history.push(
      '/workOutAdd/' + this.props.match.params.caller)
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(WorkOutList)

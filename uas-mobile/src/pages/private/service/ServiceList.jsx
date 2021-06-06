/**
 * Created by RaoMeng on 2020/12/9
 * Desc: 应用列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyList from '../../../components/common/currencyList/CurrencyList'
import { API } from '../../../configs/api.config'

class ServiceList extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    this.caller = this.props.match.params.caller
    this.title = this.props.match.params.title
    this.readOnly = this.props.match.params.readOnly
    document.title = this.title || '单据列表'
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div>
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
      </div>
    )
  }

  /**
   * 列表点击事件
   */
  onItemClick = (rowData) => {
    this.props.history.push(
      '/serviceDetail/' + rowData.id + '/' + this.caller + '/' + this.title)
  }

  /**
   * 单据新增
   */
  onDocAdd = () => {
    this.props.history.push(
      '/serviceAdd/' + 0 + '/' + this.caller)
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(ServiceList)

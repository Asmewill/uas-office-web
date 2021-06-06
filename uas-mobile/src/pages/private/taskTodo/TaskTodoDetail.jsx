/**
 * Created by Hujs on 2020/12/17
 * Desc: 待办任务详情
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyDetail from '../../../components/common/currencyDetail/CurrencyDetail'

class TaskTodoDetail extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    const title = this.props.match.params.title
    document.title = title || '会议详情'
  }

  componentWillUnmount () {

  }

  render () {
    return (<CurrencyDetail
      caller={this.props.match.params.caller}
      id={this.props.match.params.id}
      isDetail
    />)
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(TaskTodoDetail)

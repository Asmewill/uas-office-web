/**
 * Created by RaoMeng on 2020/12/11
 * Desc: 应用详情
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyDetail
  from '../../../components/common/currencyDetail/CurrencyDetail'

class ServiceDetail extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    const title = this.props.match.params.title
    document.title = title || '单据详情'
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

export default connect(mapStateToProps)(ServiceDetail)

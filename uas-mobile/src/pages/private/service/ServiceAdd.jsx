/**
 * Created by RaoMeng on 2020/12/15
 * Desc: 应用单据新增
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import './service.less'
import CurrencyDetail
  from '../../../components/common/currencyDetail/CurrencyDetail'

class ServiceAdd extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    this.title = this.props.match.params.title
    this.caller = this.props.match.params.caller
    document.title = this.title || '单据新增'
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div className='service-add-root'>
        <CurrencyDetail
          onRef={ref => this.cd = ref}
          caller={this.props.match.params.caller}
          id={this.props.match.params.id}
          submitSuccess={this.submitSuccess}
        >
        </CurrencyDetail>
      </div>
    )
  }

  submitSuccess = (keyValue) => {
    this.props.history.replace(
      '/serviceDetail/' + keyValue + '/' + this.props.match.params.caller +
      '/' + this.props.match.params.title,
    )
  }
}

let mapStateToProps = (state) => ({
  formState: state.formState,
})

export default connect(mapStateToProps)(ServiceAdd)

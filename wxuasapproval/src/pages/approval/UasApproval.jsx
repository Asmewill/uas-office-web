/**
 * Created by RaoMeng on 2020/2/20
 * Desc: U审批过渡页
 */

import React, { Component } from 'react'
import { clearHomeState } from '../../redux/actions/homeState'

export default class UasApproval extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = 'U审批'
    let master = this.props.match.params.master
    let pageType = this.props.match.params.type

    clearHomeState()()

    this.props.history.replace(
      '/approvalHome/' + master + (pageType ? ('/' + pageType) : ''))
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div>

      </div>
    )
  }
}

/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 通用表单添加明细
 */

import React, { Component } from 'react'
import './formCommon.less'

export default class FormAdd extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div className='form-add-text' onClick={this.onAddClick}>
        + 添加明细
      </div>
    )
  }

  onAddClick = e => {
    if (this.props.onAddClick) {
      this.props.onAddClick(this.props.groupIndex)
    }
  }
}

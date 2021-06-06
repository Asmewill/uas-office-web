/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 未订阅 左侧菜单item
 */

import React, { Component } from 'react'
import './comp-subscrive.less'

export default class SubLeftMenu extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    const { subClass } = this.props
    return (
      <div
        className={subClass.select
          ? 'comp-sub-left-menu-select'
          : 'comp-sub-left-menu'}
        onClick={this.onLeftClick}>{this.props.subClass.className}</div>
    )
  }

  onLeftClick = () => {
    this.props.onLeftClick && this.props.onLeftClick(this.props.subClass)
  }
}

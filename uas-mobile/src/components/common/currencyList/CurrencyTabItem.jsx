/**
 * Created by RaoMeng on 2020/12/9
 * Desc:通用tab item
 */

import React, { Component } from 'react'
import './currency-list-item.less'

export default class CurrencyTabItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { tabObj, isSelect } = this.props
    return (
      <div
        className={isSelect
          ? 'currency-tab-item-select'
          : 'currency-tab-item-normal'}
        onClick={this.onTabSelect}>
        {tabObj.NAME}
      </div>
    )
  }

  onTabSelect = () => {
    const { onTabSelect, tabIndex } = this.props
    onTabSelect && onTabSelect(tabIndex)
  }
}

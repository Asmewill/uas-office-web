/**
 * Created by RaoMeng on 2020/11/24
 * Desc: 通用列表单行数据
 */

import React, { Component } from 'react'
import './currency-list-item.less'

export default class CurrencyRow extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    const { rowObj } = this.props
    return (
      <div className='currency-row-root'>
        <div className='currency-row-caption'>{rowObj.caption}</div>
        <div
          className='currency-row-value'>{rowObj.value}
        </div>
      </div>
    )
  }
}

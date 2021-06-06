/**
 * Created by RaoMeng on 2020/11/24
 * Desc: 通用列表item
 */

import React, { Component } from 'react'
import './currency-list-item.less'
import CurrencyRow from './CurrencyRow'
import { isObjEmpty, isObjNull } from '../../../utils/common/common.util'

export default class CurrencyListItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { rowData: { rowList }, rowCount } = this.props
    const rowItems = []
    if (!isObjEmpty(rowList)) {
      rowList.forEach((item, index) => {
        if (isObjNull(rowCount) || index < rowCount) {
          rowItems.push(<CurrencyRow rowObj={item}/>)
        }
      })
    }

    return (
      <div
        className='currency-list-item-root'
        onClick={this.onItemClick}
      >
        {rowItems}
      </div>
    )
  }

  onItemClick = () => {
    const { rowData } = this.props
    this.props.onItemClick && this.props.onItemClick(rowData)
  }
}

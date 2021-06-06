/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 已订阅列表item
 */

import React, { Component } from 'react'
import { SUBSCRIBE_ITEM_NOT } from '../../../configs/constans.config'

export default class SubAlreadyItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { subObj, onSubItemClick } = this.props
    return (
      <div
        className='comp-sub-already-item-root'
        onClick={() => {
          onSubItemClick && onSubItemClick(subObj)
        }}>
        <img className='comp-sub-already-item-img'
             src={'data:image/jpg;base64,' + subObj.img}/>
        <div className='comp-sub-already-item-title'>{subObj.title}</div>
        {
          subObj.itemType === SUBSCRIBE_ITEM_NOT ? (
            <div className={
              subObj.status === 3
                ? 'comp-sub-already-item-func'
                : 'comp-sub-already-item-func-disable'}
                 onClick={this.onSubSelect}>{subObj.status === 1
              ? '已订阅'
              : subObj.status === 2 ? '已申请' : '+订阅'}</div>
          ) : (
            <div className='com-row-flex'>
              <div className={subObj.toMain === 0
                ? 'comp-sub-already-item-func'
                : 'comp-sub-already-item-func-disable'}
                   onClick={this.onAddHome}>{subObj.toMain === 0
                ? '+加到首页'
                : '-移出首页'}
              </div>
              <div className={subObj.isApplied === -1
                ? 'comp-sub-already-item-func'
                : 'comp-sub-already-item-func-disable'}
                   onClick={this.onUnSubSelect}>{subObj.isApplied === -1
                ? '-退订'
                : '不可退订'}
              </div>
            </div>
          )
        }
      </div>
    )
  }

  onSubSelect = (e) => {
    const { subObj, onSubSelect } = this.props
    e.stopPropagation()
    if (subObj.status === 3) {
      onSubSelect && onSubSelect(subObj)
    }
  }

  onAddHome = (e) => {
    const { subObj, onAddHome, subIndex } = this.props
    e.stopPropagation()
    onAddHome && onAddHome(subObj, subIndex)
  }

  onUnSubSelect = (e) => {
    const { subObj, onUnSubSelect, subIndex } = this.props
    e.stopPropagation()
    if (subObj.isApplied === -1) {
      onUnSubSelect && onUnSubSelect(subObj, subIndex)
    }
  }
}

/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 订阅列表 子item
 */

import React, { Component } from 'react'
import './comp-subscrive.less'

export default class SubscribeChild extends Component {

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
      <div className='comp-subscribe-child-root'
           onClick={() => {
             onSubItemClick && onSubItemClick(subObj)
           }}>
        <div className='comp-subscribe-child-title'>{subObj.TITLE_}</div>
        <div className={subObj.STATUS_ === 0
          ? 'comp-subscribe-child-unread'
          : 'comp-subscribe-child-read'}>{subObj.STATUS_ === 0
          ? '未读'
          : '已读'}</div>
        <img className='comp-subscribe-child-img'
             src={require(
               '@/res/img/sub_' + (subObj.childIndex % 10) + '.png')}/>
      </div>
    )
  }
}

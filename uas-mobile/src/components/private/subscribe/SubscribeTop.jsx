/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 订阅列表 头部item
 */

import React, { Component } from 'react'
import './comp-subscrive.less'

export default class SubscribeTop extends Component {

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
      <div className='comp-subscribe-top-root'
           onClick={() => {
             onSubItemClick && onSubItemClick(subObj)
           }}>
        <img
          className='comp-subscribe-top-img'
          src={require(
            '@/res/img/sub_top_' + (subObj.groupIndex % 5) + '.png')}/>
        <div className='comp-subscribe-top-mask'>
          <div className='comp-subscribe-top-title'>{subObj.TITLE_}</div>
          <span className={subObj.STATUS_ === 0
            ? 'comp-subscribe-top-unread'
            : 'comp-subscribe-top-read'}>{subObj.STATUS_ === 0
            ? '未读'
            : '已读'}</span>
        </div>
      </div>
    )
  }
}

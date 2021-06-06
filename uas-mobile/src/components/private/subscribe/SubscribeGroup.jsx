/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 订阅列表 母item
 */

import React, { Component } from 'react'
import './comp-subscrive.less'
import SubscribeTop from './SubscribeTop'
import SubscribeChild from './SubscribeChild'
import { isObjEmpty } from '../../../utils/common/common.util'

export default class SubscribeGroup extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    const { subGroups, onSubItemClick } = this.props
    const subItems = []
    if (!isObjEmpty(subGroups, subGroups.list)) {
      subGroups.list.forEach((item, index) => {
        if (index === 0) {
          subItems.push(<SubscribeTop
            subObj={item}
            onSubItemClick={onSubItemClick}/>)
        } else {
          subItems.push(<SubscribeChild
            subObj={item}
            onSubItemClick={onSubItemClick}/>)
        }
      })
    }
    return (
      <div className='comp-subscribe-group-root'>
        <div className='comp-subscribe-group-time'>{subGroups.groupDate}</div>
        <div className='comp-subscribe-group-content'>
          {subItems}
        </div>
      </div>
    )
  }
}

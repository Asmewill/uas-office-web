/**
 * Created by hujs on 2020/11/11
 * Desc: 打卡描述
 */

import React, { Component } from 'react'
import { List } from 'antd-mobile'
import './clock-desc.less'

const Item = List.Item
const Brief = Item.Brief

export default class ClockDesc extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { companyRule } = this.props

    return (
      <div className='punch-clock-desc'>
        <Item>
          上下班打卡<Brief>打卡规则：{companyRule}</Brief>
        </Item>
      </div>
    )
  }

}

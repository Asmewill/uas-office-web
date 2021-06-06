/**
 * Created by RaoMeng on 2020/3/4
 * Desc: 页面加载组件
 */

import React, { Component } from 'react'
import { ActivityIndicator } from 'antd-mobile'

export default class PageLoading extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  render () {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large"/>
        <span style={{ marginTop: 8 }}>页面加载中</span>
      </div>
    )
  }
}

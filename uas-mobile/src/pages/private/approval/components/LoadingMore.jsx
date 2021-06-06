/**
 * Created by RaoMeng on 2018/11/14
 * Desc: 加载更多
 */

import React, { Component } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

export default class LoadingMore extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className='common-load-more'>
        <LoadingOutlined/>
        <span style={{ marginLeft: '10px' }}>正在加载</span>
      </div>
    )
  }
}

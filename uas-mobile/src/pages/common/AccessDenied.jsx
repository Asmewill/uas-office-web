/**
 * Created by RaoMeng on 2020/11/4
 * Desc: 权限被拒绝
 */

import React, { Component } from 'react'

export default class AccessDenied extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = '没有访问权限'
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div>

      </div>
    )
  }
}

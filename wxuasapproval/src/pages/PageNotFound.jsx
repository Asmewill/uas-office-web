/**
 * Created by RaoMeng on 2020/10/27
 * Desc: 404页面
 */

import React, { Component } from 'react'

export default class PageNotFound extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = '页面未找到'
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

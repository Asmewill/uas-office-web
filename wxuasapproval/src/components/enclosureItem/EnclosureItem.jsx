/**
 * Created by RaoMeng on 2020/2/13
 * Desc: 附件列表
 */

import React, { Component } from 'react'
import './enclosureItem.css'

export default class EnclosureItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { approval } = this.props

    return (
      <div className='enclosure-parent'>
        <div className='enclosure-value'
             onClick={this.onEnclosureSelect}>{approval.caption}</div>
      </div>
    )
  }

  onEnclosureSelect = () => {
    this.props.onEnclosureSelect(this.props.index)
  }
}

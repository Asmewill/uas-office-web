/**
 * Created by RaoMeng on 2021/4/12
 * Desc: 单行表单
 */

import React, { Component } from 'react'
import './formCommon.less'
import { Icon } from 'antd-mobile'

export default class FormLine extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { caption, required, arrow, children } = this.props
    return (
      <div className='form-common-layout'
           style={{ minHeight: '46px' }}>
        <div className='form-input-caption'>{caption}</div>
        <div className={required
          ? 'form-input-fill'
          : 'visibleHidden'}>*
        </div>
        <div className='form-input-value'>
          {children}
        </div>
        {arrow && <Icon
          type={'right'}
          color={'#666666'}
          onClick={this.props.onArrowClick}/>}
      </div>
    )
  }
}

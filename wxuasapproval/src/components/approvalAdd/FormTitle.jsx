/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 通用表单标题类型
 */

import React, { Component } from 'react'
import './formCommon.css'
import { isObjEmpty, isObjNull } from '../../utils/common'

export default class FormTitle extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    const { billModel } = this.props
    return (
      <div
        className={isObjNull(billModel)
          ? 'displayNone'
          : 'form-common-layout'}
        style={{ background: '#efefef' }}>
        <div className='form-title-text'>{billModel.caption}</div>
        <div className={billModel.allowBlank == 'F'
          ? 'displayNone'
          : 'form-title-delete'}
             onClick={this.onDeleteClick}>删除
        </div>
      </div>
    )
  }

  onDeleteClick = e => {
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(this.props.groupIndex)
    }
  }
}

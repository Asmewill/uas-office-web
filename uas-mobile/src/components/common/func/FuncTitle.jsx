/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 应用分组标题
 */

import React, { Component } from 'react'
import './common-func.less'
import { Icon } from 'antd-mobile'

export default class FuncTitle extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { funcTitle, leftIcon, rightIcon, card } = this.props
    return (
      <div className='func-title-layout'>
        {
          leftIcon &&
          <Icon className='func-title-icon' type={leftIcon}/>
        }
        <span
          className={
            card ? 'func-title-card-text' : 'func-title-text'
          }
        >{funcTitle.groupTitle}</span>
        {
          rightIcon &&
          <Icon
            className='func-title-icon'
            type={rightIcon}
            onClick={this.onRightClick}
          />
        }
      </div>
    )
  }

  onRightClick = () => {
    this.props.onRightClick && this.props.onRightClick(this.props.funcTitle)
  }
}

/**
 * Created by RaoMeng on 2020/2/27
 * Desc: 人员组织架构
 */

import React, { Component } from 'react'
import './employee.less'

export default class EmployeeItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  render () {
    const { employee } = this.props
    return (
      <div className='employee-item-root'>
        <div className='employee-item-line'>
          <div className='employee-item-caption'>姓名：</div>
          <div className='employee-item-value'>
            {employee.EM_NAME}
          </div>
        </div>
        <div className='employee-item-line'>
          <div className='employee-item-caption'>岗位：</div>
          <div className='employee-item-value'>
            {employee.EM_POSITION}
          </div>
        </div>
        <div className='employee-item-line'>
          <div className='employee-item-caption'>组织：</div>
          <div className='employee-item-value'>
            {employee.EM_DEFAULTORNAME}
          </div>
        </div>
      </div>
    )
  }
}

/**
 * Created by RaoMeng on 2020/2/18
 * Desc: 审批列表item
 */

import React, { Component } from 'react'
import './approvalItem.css'
import moment from 'moment'
import { isObjEmpty } from '../../utils/common'

export default class ApprovalItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { approval, type } = this.props
    let approvalStatus = '等待我审批'
    let statusColor = '#33A3F4'
    if (type === 2) {
      approvalStatus = approval.JN_DEALRESULT
      if (!isObjEmpty(approvalStatus)) {
        if (approvalStatus.startWith('不同意') || approvalStatus.startWith('结束流程')
          || approvalStatus.startWith('未通过')) {
          approvalStatus = '未通过'
          statusColor = '#db3a34'
        } else if (approvalStatus.startWith('变更处理人')) {
          statusColor = '#999999'
          if (!isObjEmpty(approval.JN_OPERATEDDESCRIPTION)) {
            approvalStatus = '变更处理人(' + approval.JN_OPERATEDDESCRIPTION + ')'
          } else {
            approvalStatus = '变更处理人'
          }
        } else {
          approvalStatus = '已审批'
          statusColor = '#999999'
        }
      }
    } else if (type === 3) {
      approvalStatus = approval.JP_STATUS
      if (!isObjEmpty(approvalStatus)) {
        if (approvalStatus === '待审批') {
          statusColor = '#33A3F4'
          approvalStatus = '等待' + approval.JP_NODEDEALMANNAME + '审批'
        } else if (approvalStatus === '未通过') {
          statusColor = '#db3a34'
        } else {
          statusColor = '#999999'
        }
      }
    }

    return (
      <div style={{ padding: '0 10px' }} onClick={this.onItemClick}>
        <div className='recharge-item-root'>
          <div className='homework-item-title-layout'>
            {approval.JP_LAUNCHERNAME +
            '的' + approval.JP_NAME}
          </div>
          <div className='gray-line'
               style={{ height: '1px', marginBottom: '4px' }}></div>
          <div className='recharge-item-line'>
            <div className='recharge-item-caption'>单号：</div>
            <div className='recharge-item-value'>
              {approval.JP_CODEVALUE}
            </div>
          </div>
          <div className='recharge-item-line'>
            <div className='recharge-item-caption'>{approval.JN_DEALTIME ===
            undefined ? '发起时间：' : '处理时间：'}</div>
            <div
              className='recharge-item-value'>{!isObjEmpty(
              approval.JP_LAUNCHTIME)
              ? moment(approval.JP_LAUNCHTIME).format('YYYY-MM-DD HH:mm:ss')
              : !isObjEmpty(approval.JN_DEALTIME) ? moment(
                approval.JN_DEALTIME).format('YYYY-MM-DD HH:mm:ss') : ''
            }</div>
          </div>
          <div className='recharge-item-line' style={{ paddingBottom: '6px' }}>
            <div className='recharge-item-caption'>{
              /*approval.JP_STATUS
                ? '单据状态：'
                : approval.JN_DEALRESULT ? '审批结果：' :*/
              '状态：'}</div>
            <div
              // className='recharge-item-value'
              style={{
                background: statusColor,
                borderRadius: '8px',
                color: 'white',
                padding: '1px 6px',
                fontSize: '12px',
              }}>{approvalStatus}</div>
          </div>
        </div>
      </div>
    )
  }

  onItemClick = () => {
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.index, this.props.approval)
    }
  }
}

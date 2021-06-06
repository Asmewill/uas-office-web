/**
 * Created by hujs on 2020/12/11
 * Desc: 日常任务
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'
import { Toast, List, TextareaItem, Button } from 'antd-mobile'
import { fetchPostObj, fetchGet, fetchPostForm } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import './task-todo-work.less'

class DailyTask extends Component {

  constructor () {
    super()

    this.state = {
      textAreaValue: '',
      detailData: {},
      replyData: [],
    }
  }

  componentDidMount () {
    let { type, id } = this.props.match.params
    this.getDatailData(type, id)
  }

  componentWillUnmount () {

  }

  render () {
    let { detailData, replyData } = this.state
    let replyDetail = null
    if (!isObjEmpty(replyData)) {
      replyDetail = this.handlerReplyData(replyData)
    }
    let replyModule = this.handlerReplyModule(detailData)

    let buttonModule = this.handlerButtonModule(detailData)

    return (
      <div className="daily-task-page">
        <div className="daily-task-page-content">
          <div className="task-des-panel">
            <div className="task-des-item">
              <div className="task-item-caption">任务名称</div>
              <div className="task-item-value">{detailData.ra_taskname}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">提出人</div>
              <div className="task-item-value">{detailData.recorder}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">执行人</div>
              <div className="task-item-value">{detailData.ra_resourcename}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">开始时间</div>
              <div className="task-item-value">{detailData.ra_startdate}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">结束时间</div>
              <div className="task-item-value">{detailData.ra_enddate}</div>
            </div>
          </div>

          {/* 处理明细信息 */}
          {
            replyDetail
          }

          {/* 回复确定信息组件 */}
          {
            replyModule
          }
        </div>


        {/* 按钮 */}
        {
          buttonModule
        }


      </div>
    )
  }

  getDatailData = (type, id) => {
    Toast.loading('正在获取数据', 0)
    fetchPostObj(API.APPCOMMON_TASKDETAIL, {
      type: type,
      ra_id: id,
    }).then(response => {
      Toast.hide()
      this.setState({
        detailData: response.data.list[0].data,
        replyData: response.data.list[0].replyData,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('日常任务获取失败')
      }
    })
  }

  handlerReplyData = (replyData) => {
    const replyItems = []
    replyData.forEach((item, index) => {
      let type = '回复'
      if (item.WR_PROGRESS == 'reply') {
        type = '回复'
      } else if (item.WR_PROGRESS == 'confirm') {
        type = '确认'
      } else if (item.WR_PROGRESS == 'noconfirm') {
        type = '驳回'
      }
      replyItems.push(
        <div key={index} className="task-handler-detail">
          <p className="task-detail-info">
            <span className="task-info-left">{item.WR_RECORDER}</span>
            <span className="task-info-right">{item.WR_RECORDDATE}</span>
          </p>
          <p className="task-detail-reply">{type}信息：{item.WR_REDCORD}</p>
        </div>,
      )
    })
    return (
      <div className="task-handler-panel">
        <div className="task-handler-title">
          处理明细
        </div>
        {
          replyItems
        }
      </div>
    )
  }

  handlerReplyModule = (detailData) => {
    let status = detailData.ra_status
    let type = ''
    if (status != '待确认') {
      type = '回复信息'
    } else if (status == '待确认') {
      type = '确认信息'
    }

    return (
      status == '已完成' ? null :
        <div className="task-affirm-panel">
          <div className="task-affirm-title">
            {type}<span style={{ color: 'red' }}>*</span>
          </div>
          <List>
            <TextareaItem
              rows={3}
              placeholder="请输入"
              onChange={this.onTextChange}
            />
          </List>
        </div>
    )

  }

  handlerButtonModule = (detailData) => {
    let userName = this.props.userState.userName
    let status = detailData.ra_status

    if (status == '已完成') {
      return null
    } else if (status != '待确认' && userName == detailData.ra_resourcename) {
      return (
        <div className="task-btn-panel">
          <Button
            className='task-btn-panel-button'
            type="primary"
            onClick={this.onReply}
            inline>回复</Button>
        </div>
      )
    } else if (status == '待确认' && userName == detailData.ra_resourcename) {
      return (
        <div className="task-btn-panel">
          <Button
            className='task-btn-panel-button'
            type="primary"
            onClick={this.onConfirm}
            inline>确认</Button>
          <Button
            className='task-btn-panel-button'
            type="primary"
            onClick={this.onReject}
            inline>驳回</Button>
        </div>
      )
    }

  }

  onTextChange = value => {
    this.setState({
      textAreaValue: value,
    })
  }

  onReject = () => {
    let info = this.state.textAreaValue
    let ra_id = this.state.detailData.ra_id
    if (info == '') {
      message.error('请填写信息')
      return false
    }
    fetchPostForm(API.APPCOMMON_DAILYTASKNOCOMFIRM, {
      ra_id: ra_id,
      id: '',
      record: info,
    }).then(response => {
      window.location.reload()
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('回复信息失败')
      }
    })
  }

  onConfirm = () => {
    let info = this.state.textAreaValue
    let ra_id = this.state.detailData.ra_id
    if (info == '') {
      message.error('请填写信息')
      return false
    }
    fetchPostForm(API.APPCOMMON_DAILYTASKCOMFIRM, {
      ra_id: ra_id,
      id: '',
      record: info,
    }).then(response => {
      window.location.reload()
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('回复信息失败')
      }
    })
  }

  onReply = () => {
    let info = this.state.textAreaValue
    let ra_id = this.state.detailData.ra_id
    if (info == '') {
      message.error('请填写信息')
      return false
    }
    fetchPostForm(API.APPCOMMON_DAILYTASKREPLY, {
      ra_id: ra_id,
      id: '',
      record: info,
    }).then(response => {
      window.location.reload()
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('驳回失败')
      }
    })
  }

}

let mapStateToProps = (state) => ({
  userState: state.userState,
})

export default connect(mapStateToProps)(DailyTask)


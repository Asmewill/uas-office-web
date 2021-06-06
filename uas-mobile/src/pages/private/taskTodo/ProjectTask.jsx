/**
 * Created by hujs on 2020/12/11
 * Desc: 项目任务
 */

import React, { Component } from 'react'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'
import { Toast, List, TextareaItem, Button, InputItem } from 'antd-mobile'
import { fetchPostObj, fetchGet, fetchPostForm } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import './task-todo-work.less'

export default class ProjectTask extends Component {

  constructor () {
    super()

    this.state = {
      detailData: {},
      completeValue: '',
      workTimeValue: '',
      textAreaValue: '',
    }
  }

  componentDidMount () {
    let { type, id } = this.props.match.params
    this.getDatailData(type, id)
  }

  componentWillUnmount () {

  }

  render () {
    let { detailData } = this.state

    return (
      <div className="daily-task-page">
        <div className="daily-task-page-content">
          <div className="task-des-panel">
            <div className="task-des-item">
              <div className="task-item-caption">任务名称</div>
              <div className="task-item-value">{detailData.wr_taskname}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">任务状态</div>
              <div className="task-item-value">{detailData.ra_status}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">项目名称</div>
              <div className="task-item-value">{detailData.wr_prjname}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">开始时间</div>
              <div className="task-item-value">{detailData.wr_taskstartdate}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">结束时间</div>
              <div className="task-item-value">{detailData.wr_taskenddate}</div>
            </div>
            <div className="task-des-item">
              <div className="task-item-caption">累计完成率(%)</div>
              <div className="task-item-value">{detailData.wr_taskpercentdone}</div>
            </div>
          </div>
          <div className="task-affirm-panel">
            <div className="task-affirm-inputitem">
              <InputItem
                placeholder="请输入"
                type={'digit'}
                onChange={this.onCompleteChange}
                value={this.state.completeValue}
              >本次完成率<span style={{ color: 'red' }}>*</span>
              </InputItem>
            </div>
            <div className="task-affirm-inputitem">
              <InputItem
                placeholder="请输入"
                type={'digit'}
                onChange={this.onWorkTimeChange}
              >工作时数<span style={{ color: 'red' }}>*</span>
              </InputItem>
            </div>
            <div className="task-affirm-title">
              工作描述<span style={{ color: 'red' }}>*</span>
              <TextareaItem
                rows={3}
                placeholder="请输入"
                onChange={this.onTextChange}
              />
            </div>
          </div>
        </div>
        <div className="task-btn-panel">
          <Button
            className='task-btn-panel-button'
            type="primary"
            onClick={this.onCommit}
            inline>提交</Button>
        </div>
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
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('项目任务获取失败')
      }
    })
  }

  onTextChange = value => {
    this.setState({
      textAreaValue: value,
    })
  }
  onCompleteChange = value => {
    if (value > 100) {
      message.error('提交完成率不能大于100')
      this.setState({
        completeValue: '',
      })
      return false
    }
    this.setState({
      completeValue: value,
    })
  }
  onWorkTimeChange = value => {
    this.setState({
      workTimeValue: value,
    })
  }

  onCommit = () => {
    let { wr_raid } = this.state.detailData
    if (this.state.completeValue == '') {
      message.error('请填写本次完成率')
      return false
    }
    if (this.state.textAreaValue == '') {
      message.error('请填写工作描述')
      return false
    }
    if (this.state.workTimeValue == '' || this.state.workTimeValue == '0') {
      message.error('请填写正确的工作时数')
      return false
    }
    if (this.state.detailData.wr_taskpercentdone + Number(this.state.completeValue) > 100) {
      message.error('累计完成率超过100，请重新输入')
      this.setState({
        completeValue: '',
      })
      return false
    }
    fetchPostObj(API.APPCOMMON_PROJECTCOMMIT, {
      ra_id: wr_raid,
      wr_hours: this.state.workTimeValue,
      wr_percentdone: this.state.completeValue,
      wr_redcord: this.state.textAreaValue,
    }).then(response => {
      window.location.reload()
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('提交失败')
      }
    })

  }

}


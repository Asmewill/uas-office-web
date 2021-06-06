/**
 * Created by hujs on 2020/11/11
 * Desc: 打卡记录
 */

import React, { Component } from 'react'
import './clock-record.less'

export default class ClockRecord extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { clockRecord } = this.props
    let { onTime, offTime } = clockRecord
    return (
      <div className='punch-clock-record'>
        <div className="clock-record-left">
          <div className="clock-record-on-time">{onTime.time}</div>
          <div className="clock-record-trans"></div>
          <div className="clock-record-off-time">{offTime.time}</div>
        </div>
        <div className="clock-record-right">
          <div
            className={onTime.type == '未打卡' || onTime.type == '迟到' ? 'punch-clock-on-time punch-clock-box punch-clock-box-delay' : 'punch-clock-on-time punch-clock-box punch-clock-box-normal'}>
            <div className="on-work">上班{onTime.auto ? '·自动' : ''}</div>
            <div
              className="on-work-time">{onTime.type == '未打卡' ? '未打卡' : onTime.type + '(' + onTime.punchTime + ')'}</div>
          </div>
          <div
            className={offTime.type == '未打卡' || offTime.type == '迟到' || offTime.type == '早退' ? 'punch-clock-on-time punch-clock-box punch-clock-box-delay' : 'punch-clock-on-time punch-clock-box punch-clock-box-normal'}>
            <div className="off-work">下班{offTime.auto ? '·自动' : ''}</div>
            <div
              className="off-work-time">{offTime.type == '未打卡' ? '未打卡' : offTime.type + '(' + offTime.punchTime + ')'}</div>
          </div>
        </div>
      </div>
    )
  }

}

/**
 * Created by hujs on 2020/11/11
 * Desc: 通知事项
 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './notice-matter.less'
import { Steps, Divider } from 'antd'
import { isObjEmpty } from '../../../utils/common/common.util'

const { Step } = Steps

class NoticeMatter extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { noticeMatterData } = this.props
    let MeetingList = []
    if (!isObjEmpty(noticeMatterData)) {
      noticeMatterData.forEach((item, index) => {
        MeetingList.push(
          <Step className={item.CALLER == '' ? '' : 'step-icon'} key={index} status="finish" title={item.TIME}
                description={item.MEETINGNAME + '来自(' + item.MEETINGFROM + ')'}
                onClick={this.onJumpDetail.bind(this, item)}/>,
        )
      })
    }

    return (
      <div className='notice-matter'>
        <Steps progressDot direction="vertical">
          {MeetingList}
        </Steps>
      </div>
    )
  }

  onJumpDetail = (item) => {
    let { ID, CALLER, MEETINGFROM } = item
    if (MEETINGFROM == '会议') {
      this.props.history.push(
        '/conferenceDetail/' + ID + '/' + CALLER)
    } else {
      this.props.history.push(
        '/serviceDetail/' + ID + '/' + CALLER)
    }
  }

}

export default withRouter(NoticeMatter)

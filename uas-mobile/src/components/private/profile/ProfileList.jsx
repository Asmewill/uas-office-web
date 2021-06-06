/**
 * Created by hujs on 2020/11/9
 * Desc: 我的信息设置列
 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './Profile.less'
import { List } from 'antd-mobile'

const Item = List.Item

class ProfileList extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { accountName } = this.props
    return (
      <div className="mine-setting">
        <Item arrow="horizontal" extra={accountName} onClick={this.changeAccount}>切换账套</Item>
        {/* <Item arrow="horizontal">清除缓存</Item> */}
        <Item arrow="horizontal" onClick={this.userFeedback}>用户反馈</Item>
        <Item arrow="horizontal" onClick={this.contactInfo}>关于我们</Item>
      </div>
    )
  }

  //切换账套
  changeAccount = () => {
    this.props.history.push('/changeAccount')
  }
  //用户反馈
  userFeedback = () => {
    this.props.history.push('/userFeedback')
  }
  //关于我们
  contactInfo = () => {
    this.props.history.push('/contactInfo')
  }

}

export default withRouter(ProfileList)

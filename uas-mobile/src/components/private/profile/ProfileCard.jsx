/**
 * Created by hujs on 2020/11/9
 * Desc: 我的信息
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isObjEmpty } from '../../../utils/common/common.util'
import './Profile.less'
import { Avatar } from 'antd'
import { Icon, List } from 'antd-mobile'
import {
  UserOutlined,
} from '@ant-design/icons'

const Item = List.Item

class ProfileCard extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {

    let { companyName, imgUrl, userName, departName, jobName } = this.props.userState

    return (
      <div className="mine-info" style={{ padding: '15px 12px 0px' }}>
        <div className="profile-layout">
          <div className="profile-info">
            <div className="company">{companyName}</div>
            <div className="name func-font-family">{userName}</div>
            <div className="post">{departName + ' > ' + jobName}</div>
          </div>
          <Avatar shape="square"
                  style={imgUrl ? '' : { backgroundColor: '#33a3f4' }}
                  size={50}
                  src={imgUrl ? imgUrl : ''}
                  icon={imgUrl ? null : <UserOutlined/>}
          />
        </div>
        <div className="profile-set">
          {/* <Item disabled={true} arrow="horizontal">设置</Item> */}
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  userState: state.userState,
})

export default connect(mapStateToProps)(ProfileCard)

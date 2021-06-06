/**
 * Created by RaoMeng on 2019/11/26
 * Desc: 判断浏览器环境，跳转相应页面
 */

import React, { Component } from 'react'
import { isMobile, isObjEmpty } from '../utils/common'
import { fetchPost } from '../utils/fetchRequest'
import { message } from 'antd'
import { Toast } from 'antd-mobile'

let mBaseUrl, mMaster, mNodeId, mUserId

export default class RedirectPage extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = '审批单据'

    let paramsStr = this.props.match.params.paramsStr
    if (isObjEmpty(paramsStr)) {
      let storage = window.localStorage
      paramsStr = storage.getItem('paramJson')
    }
    console.log('paramsStr', paramsStr)

    if (!isObjEmpty(paramsStr)) {
      try {
        let paramsJson = JSON.parse(decodeURIComponent(paramsStr))
        console.log('paramsStr', paramsJson)

        mBaseUrl = decodeURIComponent(paramsJson.baseUrl)
        console.log('paramsUrl', mBaseUrl)
        mMaster = paramsJson.master
        mNodeId = paramsJson.nodeId
        mUserId = paramsJson.userId

        let phone = paramsJson.tel
        let password = paramsJson.password

        // this.getUserInfo(mUserId)
        Toast.loading('', 0)
        this.loginErp(phone, password)
      } catch (e) {
        this.setState({
          loading: false,
        })
        message.error('参数获取失败')
      }
    } else {
      message.error('参数获取失败')
    }
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div>

      </div>
    )
  }

  getUserInfo = userId => {
    if (isObjEmpty(userId)) {
      message.error('用户信息缺失')
    } else {
      Toast.loading('', 0)
      fetchPost(mBaseUrl + '/ingding/getUserInfo.action'
        , {
          userId: userId,
          master: mMaster,
        }).then(response => {
        if (response) {
          this.loginErp(response.tel, response.password)
        } else {
          Toast.hide()
          message.error('信息获取失败')
        }
      }).catch(error => {
        Toast.hide()
        if (typeof error === 'string') {
          message.error(error)
        } else {
          message.error('信息获取失败')
        }
      })
    }
  }

  loginErp = (phone, password) => {
    fetchPost(
      mBaseUrl + '/mobile/login.action'
      , {
        'username': phone,
        'password': password,
        'master': mMaster,
      }).then((response) => {
      Toast.hide()
      console.log('login', response)
      if (response.success) {
        document.cookie = 'JSESSIONID=' + response.sessionId
        window.sessionId = response.sessionId
        window.emcode = response.erpaccount

        if (isMobile()) {
          //59490086
          this.props.history.push('/approval/%7B%22' +
            'master%22%3A%22' + mMaster + '%22%2C%22' +
            'nodeId%22%3A' + mNodeId + '%2C%22' +
            'baseUrl%22%3A%22' + encodeURIComponent(mBaseUrl) + '%22%7D')
        } else {
          window.location.href = mBaseUrl +
            'jsps/common/flow.jsp?formCondition=jp_nodeIdIS' + mNodeId
            + '&newMaster=' + mMaster + '&_noc=1'
        }
      } else {
        message.error(response.reason || '登录失败')
      }
    }).catch((error) => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('登录失败')
      }
    })
  }
}

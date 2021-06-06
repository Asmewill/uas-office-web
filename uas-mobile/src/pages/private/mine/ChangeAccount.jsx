/**
 * Created by Hujs on 2020/12/14
 * Desc: 切换账套列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isObjEmpty } from '../../../utils/common/common.util'
import { Toast, List, Modal } from 'antd-mobile'
import { fetchPostForm, fetchGet } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { message } from 'antd'
import { clearAllRedux } from '../../../redux/utils/redux.utils'
import './change-account.less'

const Item = List.Item
const alert = Modal.alert

class ChangeAccount extends Component {

  constructor () {
    super()

    this.state = {
      accountList: [],
    }
  }

  componentDidMount () {
    document.title = this.title || '切换账套'
    this.getListData()
  }

  componentWillUnmount () {
    Toast.hide()
  }

  render () {
    let { accountList } = this.state
    const rowItems = []
    if (!isObjEmpty(accountList)) {
      accountList.forEach((item, index) => {
        rowItems.push(<Item
          thumb={index == 0 ? <div className="active-block"></div> : <div
            className="block"></div>}
          extra={index == 0 ? '当前账套' : ''}
          key={index}
          arrow="horizontal"
          onClick={this.changeAccount.bind(this, item)}>
          {item.ma_function}
        </Item>)
      })
    }

    return (
      <div className="change-account-page">
        <div className="change-account-list">
          {
            rowItems
          }
        </div>
      </div>
    )
  }

  getListData = () => {
    Toast.loading('正在获取数据', 0)
    fetchGet(API.COMMON_GETACCOUNTLIST, {
      isOwnerMaster: true,
    }).then(response => {
      Toast.hide()
      this.disposeData(response.masters)
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('账套列表获取失败')
      }
    })
  }

  changeAccount = (item) => {
    if (item && item.ma_function == this.props.userState.accountName) {
      return false
    }
    alert('提示', '确定切换账套到' + item.ma_function + '?', [
      { text: '取消', onPress: () => { } },
      {
        text: '确定', onPress: () => {
          fetchPostForm(API.COMMON_CHANGEACCOUNT, {
            to: item.ma_name,
          }).then(response => {
            clearAllRedux()
            message.success('切换账套成功')
            this.props.history.goBack()
          }).catch(error => {
            if (typeof error === 'string') {
              message.error('切换失败，请检查您在(' + item.ma_name + ')的账号和密码.')
            } else {
              message.error('账套切换失败')
            }
          })
        },
      },
    ])

  }

  //处理账套数据
  disposeData = (data) => {
    let middleObj = {}
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i].ma_function == this.props.userState.accountName) {
        middleObj = data[i]
        data.splice(i, 1)
      }
    }
    data.unshift(middleObj)
    this.setState({
      accountList: data,
    })
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
  userState: state.userState,
})

export default connect(mapStateToProps)(ChangeAccount)

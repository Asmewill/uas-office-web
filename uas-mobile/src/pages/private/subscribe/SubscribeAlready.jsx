/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 已订阅列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import SubAlreadyItem
  from '../../../components/private/subscribe/SubAlreadyItem'
import { requestMySubscribe } from '../../../utils/private/subscribe.util'
import { isObjEmpty } from '../../../utils/common/common.util'
import RefreshLayout
  from '../../../components/common/refreshLayout/RefreshLayout'
import { _baseURL, _host, API } from '../../../configs/api.config'
import { SUBSCRIBE_ITEM_ALREADY } from '../../../configs/constans.config'
import { Toast } from 'antd-mobile'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { message } from 'antd'
import { saveListState } from '../../../redux/actions/listState'

class SubscribeAlready extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: false,
    }
  }

  componentDidMount () {
    requestMySubscribe()
  }

  componentWillUnmount () {

  }

  render () {
    const { refreshing } = this.state
    const { listState: { listData2 } } = this.props
    let subAlreadyItems = []
    if (!isObjEmpty(listData2)) {
      listData2.forEach((item, index) => {
        subAlreadyItems.push(<SubAlreadyItem
          subObj={{
            ...item,
            type: SUBSCRIBE_ITEM_ALREADY,
          }}
          onSubItemClick={this.onSubItemClick.bind(this)}
          key={'subAlready' + index}
          subIndex={index}
          onAddHome={this.onAddHome.bind(this)}
          onUnSubSelect={this.onUnSubSelect.bind(this)}
        />)
      })
    }

    return (
      <RefreshLayout
        className='subscribe-already-root'
        direction={'down'}
        refreshing={refreshing}
        onRefresh={this.refreshData}
      >
        {subAlreadyItems}
      </RefreshLayout>
    )
  }

  refreshData = () => {
    this.setState({
      refreshing: true,
    })
    requestMySubscribe().then(() => {
      this.setState({
        refreshing: false,
      })
    }).catch(() => {
      this.setState({
        refreshing: false,
      })
    })
  }

  onSubItemClick = (subObj) => {
    window.open(
      _baseURL + '/common/charts/mobilePreview.action?id=' + subObj.id,
      '_self')
  }

  /**
   * 加到首页
   * @param subObj
   */
  onAddHome = (subObj, subIndex) => {
    console.log(subObj)
    Toast.loading(subObj.toMain === 0 ? '正在添加' : '正在移出', 0)
    fetchPostObj(API.SUBSCRIBE_ADDSUBSCRIBETOMAIN, {
      id_: subObj.id,
      type: subObj.toMain === 0 ? 'ADD' : 'REMOVE',
    }).then(response => {
      Toast.hide()
      message.success(subObj.toMain === 0 ? '添加成功' : '移出成功')
      const { listState: { listData2 } } = this.props
      if (!isObjEmpty(listData2, listData2[subIndex])) {
        listData2[subIndex].toMain = subObj.toMain === 0 ? -1 : 0
      }
      saveListState({
        listData2,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error(subObj.toMain === 0 ? '添加失败' : '移出失败')
      }
    })
  }

  /**
   * 退订
   * @param subObj
   * @param subIndex
   */
  onUnSubSelect = (subObj, subIndex) => {
    Toast.loading('正在退订', 0)
    fetchPostObj(API.SUBSCRIBE_CANCELSUBSCRIBE, {
      id_: subObj.id,
    }).then(response => {
      Toast.hide()
      message.success('退订成功')
      const { listState: { listData2 } } = this.props
      listData2.splice(subIndex, 1)
      saveListState({
        listData2,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('退订失败')
      }
    })
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(SubscribeAlready)

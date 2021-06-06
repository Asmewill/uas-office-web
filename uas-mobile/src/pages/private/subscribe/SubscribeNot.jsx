/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 未订阅列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import SubAlreadyItem
  from '../../../components/private/subscribe/SubAlreadyItem'
import { SUBSCRIBE_ITEM_NOT } from '../../../configs/constans.config'
import SubLeftMenu from '../../../components/private/subscribe/SubLeftMenu'
import { saveListState } from '../../../redux/actions/listState'
import { isObjEmpty } from '../../../utils/common/common.util'
import { requestSubscribeConfig } from '../../../utils/private/subscribe.util'
import RefreshLayout
  from '../../../components/common/refreshLayout/RefreshLayout'
import { _baseURL, _host, API } from '../../../configs/api.config'
import { Toast } from 'antd-mobile'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { message } from 'antd'

class SubscribeNot extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: false,
    }
  }

  componentDidMount () {
    requestSubscribeConfig()
  }

  componentWillUnmount () {

  }

  render () {
    const { listState: { listData, leftSelect } } = this.props
    const leftItems = [], rightItems = []
    if (!isObjEmpty(listData)) {
      listData.forEach((item, index) => {
        leftItems.push(
          <SubLeftMenu
            subClass={{
              className: item.className,
              classIndex: index,
              select: leftSelect === index,
            }}
            onLeftClick={this.onLeftClick.bind(this)}
          />,
        )
      })

      const sublist = listData[leftSelect] && listData[leftSelect].subList
      if (!isObjEmpty(sublist)) {
        sublist.forEach((item, index) => {
          rightItems.push(
            <SubAlreadyItem
              subObj={{
                ...item,
                type: SUBSCRIBE_ITEM_NOT,
              }}
              onSubItemClick={this.onSubItemClick.bind(this)}
              key={'subNot' + index}
              onSubSelect={this.onSubSelect.bind(this)}
            />,
          )
        })
      }
    }
    return (
      <div className='subscribe-not-root'>
        <div
          className='subscribe-not-left-menu'>
          {leftItems}
        </div>
        <div className='subscribe-not-right-list'>
          <RefreshLayout
            refreshing={this.state.refreshing}
            direction={'down'}
            onRefresh={this.refreshData}>
            {rightItems}
          </RefreshLayout>
        </div>

      </div>
    )
  }

  onLeftClick = (subClass) => {
    saveListState({
      leftSelect: subClass.classIndex,
      scrollTop: 0,
    })
  }

  refreshData = () => {
    this.setState({
      refreshing: true,
    })
    requestSubscribeConfig().then(() => {
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

  onSubSelect = (subObj) => {
    Toast.loading('申请订阅', 0)
    fetchPostObj(API.SUBSCRIBE_APPLYSUBSCRIBE, {
      id_: subObj.id,
    }).then(response => {
      Toast.hide()
      message.success('申请成功')
      const { listState: { listData } } = this.props
      if (!isObjEmpty(listData, listData[subObj.groupIndex],
        listData[subObj.groupIndex].subList,
        listData[subObj.groupIndex].subList[subObj.childIndex])) {
        listData[subObj.groupIndex].subList[subObj.childIndex].status = 2
      }
      saveListState({ listData })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('申请失败')
      }
    })
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(SubscribeNot)

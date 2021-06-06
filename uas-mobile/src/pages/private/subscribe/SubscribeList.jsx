/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 订阅列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { PullToRefresh, ListView } from 'antd-mobile'
import LoadingMore from '../../../components/common/loading/LoadingMore'
import { isObjEmpty } from '../../../utils/common/common.util'
import SubscribeGroup
  from '../../../components/private/subscribe/SubscribeGroup'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { Empty, message } from 'antd'
import { saveListState } from '../../../redux/actions/listState'
import { LIST_PAGE_SIZE } from '../../../configs/constans.config'

let mPageIndex = 0
let mSubscribeList = []

class SubscribeList extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: true,
      hasNextPage: true,
      isEmpty: false,
      height: document.documentElement.clientHeight,
      subscribeDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount () {
    document.title = '我的订阅'
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop
    this.setState({
      height: hei,
      refreshing: false,
      isEmpty: false,
    })
    if (this.props.listState && !isObjEmpty(this.props.listState.listData)) {
      mPageIndex = this.props.listState.pageIndex
      mSubscribeList = this.props.listState.listData
      this.setState({
          subscribeDataSource: this.state.subscribeDataSource.cloneWithRows(
            mSubscribeList),
          hasNextPage: this.props.listState.hasNextPage,
        },
        () => {
          ReactDOM.findDOMNode(
            this.lv).scrollTop = this.props.listState.scrollTop
          if (this.state.hasNextPage) {
            this.loadSubscribeList()
          }
        },
      )
    } else {
      mPageIndex = 0
      mSubscribeList = []
      this.loadSubscribeList()
    }
  }

  componentWillUnmount () {

  }

  render () {
    const {
      subscribeDataSource,
      height,
      hasNextPage,
      isEmpty,
    } = this.state

    const refreshLayout = this.getRefreshLayout()
    return (
      <div className='com-column-flex'>
        <ListView
          ref={el => this.lv = el}
          dataSource={subscribeDataSource}
          initialListSize={LIST_PAGE_SIZE}
          renderFooter={() => {
            return (
              hasNextPage ? <LoadingMore/> :
                (isEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : '')
            )
          }}
          renderRow={(rowData, sectionID, rowID) => {
            return <SubscribeGroup
              subGroups={rowData}
              onSubItemClick={this.onSubItemClick.bind(this)}/>
          }}
          style={{
            height,
          }}
          pullToRefresh={refreshLayout}
          onEndReachedThreshold={10}
          onEndReached={this.loadSubscribeList}
          pageSize={LIST_PAGE_SIZE}
        />
      </div>
    )
  }

  getRefreshLayout () {
    const { refreshing } = this.state
    return <PullToRefresh
      refreshing={refreshing}
      onRefresh={() => {
        this.setState({
          refreshing: true,
          isEmpty: false,
          hasNextPage: true,
        })
        mPageIndex = 0
        mSubscribeList = []
        this.loadSubscribeList()
      }}
    />
  }

  loadSubscribeList = () => {
    mPageIndex++
    if (mPageIndex === 1) {
      this.setState({
        subscribeDataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      })
    }

    fetchPostObj(API.SUBSCRIBE_SUBSCRIBETOPUSH, {
      pageIndex: mPageIndex,
      pageSize: LIST_PAGE_SIZE,
    }).then(response => {
      if (!isObjEmpty(response, response.data, response.data.list)) {
        response.data.list.forEach((groupItem, groupIndex) => {
          let groupSub = {
            groupDate: groupItem.groupDate,
            groupIndex: mSubscribeList.length,
          }
          if (!isObjEmpty(groupItem.list)) {
            groupItem.list.forEach((childItem, childIndex) => {
              childItem.groupIndex = mSubscribeList.length
              childItem.childIndex = childIndex
            })
          }
          groupSub.list = groupItem.list
          mSubscribeList.push(groupSub)
        })
        this.setState({
          subscribeDataSource: this.state.subscribeDataSource.cloneWithRows(
            mSubscribeList),
          hasNextPage: response.data.list.length >= LIST_PAGE_SIZE,
          isEmpty: false,
        })
      } else {
        mPageIndex--
        this.setState({
          hasNextPage: false,
          isEmpty: mPageIndex === 0,
        })
      }
      this.setState({
        refreshing: false,
      })
    }).catch(error => {
      mPageIndex--
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('数据获取失败')
      }
      this.setState({
        refreshing: false,
      })
    })
  }

  onSubItemClick = (subObj) => {
    if (!isObjEmpty(mSubscribeList, mSubscribeList[subObj.groupIndex],
      mSubscribeList[subObj.groupIndex].list,
      mSubscribeList[subObj.groupIndex].list[subObj.childIndex])) {
      mSubscribeList[subObj.groupIndex].list[subObj.childIndex].STATUS_ = -1
      this.setState({
        subscribeDataSource: this.state.subscribeDataSource.cloneWithRows(
          JSON.parse(
            JSON.stringify(mSubscribeList))),
      })

      saveListState({
        scrollTop: ReactDOM.findDOMNode(this.lv).scrollTop,
        pageIndex: mPageIndex,
        listData: mSubscribeList,
        hasNextPage: this.state.hasNextPage,
      })
      this.props.history.push(
        '/subscribeChart/' + subObj.ID_ + '/' + subObj.NUM_ID_ + '/' +
        subObj.INSTANCE_ID_)
    }
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(SubscribeList)

/**
 * Created by RaoMeng on 2020/2/17
 * Desc: 审批功能首页
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { TabBar, SearchBar } from 'antd-mobile'
import { List, Icon, Skeleton, message } from 'antd'
import './approval.css'
import Swiper from 'swiper/js/swiper.min'
import 'swiper/css/swiper.min.css'
import RefreshLayout from '../../components/RefreshLayout'
import { getIntValue, isObjEmpty, isObjNull } from '../../utils/common'
import { fetchGet } from '../../utils/fetchRequest'
import { connect } from 'react-redux'
import { LocalImgs } from '../../configs/Constants'
import {
  clearHomeState,
  clearNewState,
  clearReceiveState,
  clearSendState,
  freshHomeState,
  saveNewState,
  saveReceiveState,
  saveSendState,
} from '../../redux/actions/homeState'
import CustomIcon from '../../utils/CustomIcon'
import ApprovalItem from '../../components/approvalItem/ApprovalItem'
import LoadingMore from '../../components/LoadingMore'
import InfiniteScroll from 'react-infinite-scroller'

let mMaster
const mPageSize = 20
let mTodoIndex = 0
let mDoneIndex = 0
let mSendIndex = 0

let mBaseUrl = window.location.origin
  + (process.env.REACT_APP_ROUTER_BASE_NAME || '')
  // && 'http://usoft.f3322.net:10007/uas'

class ApprovalHome extends Component {

  constructor () {
    super()

    this.state = {
      pageVisible: false,
      tabHidden: false,
      isNewMenuLoading: true,
      isReceiveTodoLoading: true,
      isReceiveDoneLoading: true,
      isReceiveTodoRefresh: false,
      isReceiveDoneRefresh: false,
      isSendRefresh: false,
      isSendLoading: true,
      receiveKey: '',
      sendKey: '',
    }
  }

  componentDidMount () {
    mMaster = this.props.match.params.master
    document.title = 'U审批'

    const { homeState } = this.props
    let { newState, receiveState, sendState, selectedTab } = homeState

    this.initSwiper(receiveState)

    this.setState({
      receiveKey: receiveState.searchKey,
      sendKey: sendState.searchKey,
    })

    let pageType = this.props.match.params.type
    if (pageType == 'receive') {
      selectedTab = 1
      freshHomeState({
        selectedTab: 1,
      })()
    } else if (pageType == 'send') {
      selectedTab = 2
      freshHomeState({
        selectedTab: 2,
      })()
    }
    switch (selectedTab) {
      case 0: {
        this.initNew(newState)
        this.initReceive(receiveState)
        break
      }
      case 1: {
        this.initReceive(receiveState)
        break
      }
      case 2: {
        this.initSend(sendState)
        break
      }
      default:
        break
    }
  }

  initSwiper (receiveState) {
    let that = this
    this.mySwiper = new Swiper('.swiper-container', {
      autoplay: false,
      loop: false,
      noSwiping: true,
      initialSlide: receiveState.tabIndex,
      on: {
        slideChangeTransitionEnd: function () {
          saveReceiveState({
            tabIndex: this.activeIndex,
          })()
          if (this.activeIndex == 0) {
            that.refreshTodoList()
          } else {
            that.refreshDoneList()
          }
        },
      },
    })
  }

  initNew (newState) {
    if (!isObjEmpty(newState.newMenuList)) {
      this.setState({
        isNewMenuLoading: false,
      }, () => {
        setTimeout(() => {
          ReactDOM.findDOMNode(this.newList).parentNode.scrollTop =
            newState.scrollTop
        }, 10)
      })
    } else {
      this.getNewMenuData()
    }
  }

  initReceive (receiveState) {
    if (receiveState && receiveState.tabIndex >= 0) {
      this.mySwiper.slideTo(receiveState.tabIndex, 0, false)
    }

    if (receiveState && !isObjEmpty(receiveState.listData)) {
      this.setState({
        isReceiveTodoLoading: false,
      }, () => {
        setTimeout(() => {
          ReactDOM.findDOMNode(this.todoTab).parentNode.scrollTop =
            receiveState.scrollTop
        }, 10)
      })
      mTodoIndex = receiveState.pageIndex
    } else {
      mTodoIndex = 0
      this.loadTodoList()
    }

    if (receiveState && !isObjEmpty(receiveState.listData2)) {
      this.setState({
        isReceiveDoneLoading: false,
      }, () => {
        setTimeout(() => {
          ReactDOM.findDOMNode(this.doneTab).parentNode.scrollTop =
            receiveState.scrollTop2
        }, 10)

      })
      mDoneIndex = receiveState.pageIndex2
    } else {
      mDoneIndex = 0
      this.loadDoneList()
    }
  }

  initSend (sendState) {
    if (!isObjEmpty(sendState.sendList)) {
      this.setState({
        isSendLoading: false,
      }, () => {
        setTimeout(() => {
          ReactDOM.findDOMNode(this.sendList).parentNode.scrollTop =
            sendState.scrollTop
        }, 10)
      })
    } else {
      mSendIndex = 0
      this.loadSendList()
    }
  }

  componentWillUnmount () {
    // clearHomeState()()
  }

  render () {
    return (
      <div className={'home-root'}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          prerenderingSiblingsNumber={2}
          hidden={this.state.tabHidden}
        >
          {this.getNewTab()}
          {this.getReceiveTab()}
          {this.getSendTab()}
        </TabBar>
      </div>
    )
  }

  /**
   * 【新建】
   * @returns {*}
   */
  getNewTab = () => {
    return (
      <TabBar.Item
        title="新建"
        key="New"
        icon={<CustomIcon type="icon-new"/>}
        selectedIcon={<CustomIcon type="icon-new-selected"/>}
        selected={this.props.homeState.selectedTab === 0}
        // badge={''}
        onPress={this.onTab1Selected}
      >
        {this.renderNewTab()}
      </TabBar.Item>
    )
  }

  /**
   * 【我的审批】
   * @returns {*}
   */
  getReceiveTab = () => {
    return (
      <TabBar.Item
        title="我的审批"
        key="Receive"
        icon={<CustomIcon type='icon-receive'/>}
        selectedIcon={<CustomIcon type="icon-receive-selected"/>}
        selected={this.props.homeState.selectedTab === 1}
        badge={this.props.homeState.receiveState
          ? this.props.homeState.receiveState.todoCount : 0}
        onPress={this.onTab2Selected}
      >
        {this.renderReceiveTab()}
      </TabBar.Item>
    )
  }

  /**
   * 【我发起的】
   * @returns {*}
   */
  getSendTab = () => {
    return (
      <TabBar.Item
        title="我发起的"
        key="Send"
        icon={<CustomIcon type="icon-send"/>}
        selectedIcon={<CustomIcon type="icon-send-selected"/>}
        selected={this.props.homeState.selectedTab === 2}
        // badge={''}
        onPress={this.onTab3Selected}
      >
        {this.renderSendTab()}
      </TabBar.Item>
    )
  }

  onTab1Selected = () => {
    const { isNewMenuLoading } = this.state
    const { homeState: { newState, selectedTab } } = this.props
    if (selectedTab === 0) {
      // 刷新页面
      if (!isNewMenuLoading) {
        this.setState({
          isNewMenuLoading: true,
        })
        clearNewState()()
        this.getNewMenuData()
      }
    } else {
      if (isObjEmpty(newState.newMenuList)) {
        this.setState({
          isNewMenuLoading: true,
        })
        this.getNewMenuData()
      } else {
        this.setState({
          isNewMenuLoading: false,
        }, () => {

        })
      }
    }
    freshHomeState({
      selectedTab: 0,
    })()
  }

  onTab2Selected = () => {
    const { isReceiveTodoLoading, isReceiveDoneLoading } = this.state
    const { homeState: { receiveState, selectedTab } } = this.props
    if (selectedTab === 1) {
      // 刷新页面
      clearReceiveState()()
      this.setState({
        receiveKey: '',
      })
      this.mySwiper.slideTo(0, 0, false)
      if (!isReceiveTodoLoading) {
        this.setState({
          isReceiveTodoLoading: true,
        })
        mTodoIndex = 0
        this.loadTodoList()
      }
      if (!isReceiveDoneLoading) {
        this.setState({
          isReceiveDoneLoading: true,
        })
        mDoneIndex = 0
        this.loadDoneList()
      }
    } else {
      if (isObjEmpty(receiveState.listData)) {
        this.setState({
          isReceiveTodoLoading: true,
        })
        mTodoIndex = 0
        this.loadTodoList()
      } else {
        this.setState({
          isReceiveTodoLoading: false,
        }, () => {

        })
        mTodoIndex = receiveState.pageIndex
      }
      if (isObjEmpty(receiveState.listData2)) {
        this.setState({
          isReceiveDoneLoading: true,
        })
        mDoneIndex = 0
        this.loadDoneList()
      } else {
        this.setState({
          isReceiveDoneLoading: false,
        }, () => {

        })
        mDoneIndex = receiveState.pageIndex2
      }
    }
    freshHomeState({
      selectedTab: 1,
    })()
  }

  onTab3Selected = () => {
    const { isSendLoading } = this.state
    const { homeState: { sendState, selectedTab } } = this.props
    if (selectedTab === 2) {
      // 刷新页面
      clearSendState()()
      this.setState({
        sendKey: '',
      })
      if (!isSendLoading) {
        this.setState({
          isSendLoading: true,
        })
        mSendIndex = 0
        this.loadSendList()
      }
    } else {
      if (isObjEmpty(sendState.sendList)) {
        this.setState({
          isSendLoading: true,
        })
        mSendIndex = 0
        this.loadSendList()
      } else {
        this.setState({
          isSendLoading: false,
        }, () => {

        })
      }
    }
    freshHomeState({
      selectedTab: 2,
    })()
  }

  renderNewTab = () => {
    return (
      <div
        ref={el => {
          this.newList = el
        }}
        id='newMenu-root'>
        <Skeleton loading={this.state.isNewMenuLoading} active
                  paragraph={{ rows: 4 }}>
          {this.getNewMenu()}
        </Skeleton>
      </div>
    )
  }

  renderReceiveTab = () => {
    const { homeState: { receiveState } } = this.props
    const { tabIndex } = receiveState
    const todoItems = this.renderReceiveTodoItems()
    const doneItems = this.renderReceiveDoneItems()
    return (
      <div className='receive-root'>
        <SearchBar
          value={this.state.receiveKey}
          placeholder={'搜索'}
          maxLength={16}
          onChange={value => {
            this.setState({
              receiveKey: value,
            })
          }}
          onClear={value => {
            this.setState({
              receiveKey: value,
            })
          }}
          onCancel={() => {
            this.setState({
              receiveKey: '',
            })
            if (!isObjEmpty(receiveState.searchKey)) {
              this.searchSubmit(0, '')
            }
          }}
          onSubmit={this.searchSubmit.bind(this, 0, this.state.receiveKey)}
        />
        {/*<div className='line'></div>*/}
        <div className='identity-select'>
          <div className={tabIndex === 0 ?
            'identity-item-select' : 'identity-item-normal'}
               onClick={() => {
                 this.refreshTodoList()
                 if (tabIndex === 0) {

                 } else {
                   saveReceiveState({
                     tabIndex: 0,
                   })()
                   this.mySwiper.slideTo(0, 300, false)
                 }
               }}>待审批{this.props.homeState.receiveState ?
            (this.props.homeState.receiveState.todoCount > 0
              ? ('(' + this.props.homeState.receiveState.todoCount + ')')
              : '') : ''}
          </div>
          <div className={tabIndex === 1 ?
            'identity-item-select' : 'identity-item-normal'}
               onClick={() => {
                 this.refreshDoneList()
                 if (tabIndex === 1) {

                 } else {
                   saveReceiveState({
                     tabIndex: 1,
                   })()
                   this.mySwiper.slideTo(1, 300, false)
                 }
               }}>已审批
          </div>
        </div>
        <div className="swiper-container"
             ref={el => {
               this.contain = el
             }}>
          <div className="swiper-wrapper">
            <div className="swiper-slide swiper-no-swiping">
              {todoItems}
            </div>
            <div className="swiper-slide swiper-no-swiping">
              {doneItems}
            </div>
          </div>
        </div>
      </div>
    )
  }

  refreshDoneList () {
    const { isReceiveDoneLoading } = this.state
    if (!isReceiveDoneLoading) {
      this.setState({
        isReceiveDoneLoading: true,
      })
      saveReceiveState({
        hasMore2: true,
        scrollTop2: 0,
      })()
      mDoneIndex = 0
      this.loadDoneList()
    }
  }

  refreshTodoList () {
    const { isReceiveTodoLoading } = this.state
    if (!isReceiveTodoLoading) {
      this.setState({
        isReceiveTodoLoading: true,
      })
      saveReceiveState({
        hasMore1: true,
        scrollTop: 0,
      })()
      mTodoIndex = 0
      this.loadTodoList()
    }
  }

  renderSendTab = () => {
    const { homeState: { sendState } } = this.props

    return (
      <div className='receive-content-root'>
        <SearchBar
          value={this.state.sendKey}
          placeholder={'搜索'}
          maxLength={16}
          onChange={value => {
            this.setState({
              sendKey: value,
            })
          }}
          onClear={value => {
            this.setState({
              sendKey: value,
            })
          }}
          onCancel={() => {
            this.setState({
              sendKey: '',
            })
            if (!isObjEmpty(sendState.searchKey)) {
              this.searchSubmit(1, '')
            }
          }}
          onSubmit={this.searchSubmit.bind(this, 1, this.state.sendKey)}
        />
        <div className='receive-content-root'>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            ref={el => {
              this.sendList = el
            }}
            loadMore={this.loadSendList}
            hasMore={sendState.sendHasMore}
            loader={<LoadingMore/>}
            threshold={1}
            useWindow={false}>
            <Skeleton loading={this.state.isSendLoading} active
                      paragraph={{ rows: 4 }}>
              <List split={false}
                    dataSource={sendState.sendList}
                    renderItem={(item, index) => (
                      <ApprovalItem approval={item}
                                    type={3}
                                    onItemClick={this.onSendItemClick.bind(
                                      this)}
                                    index={index}/>
                    )}/>
            </Skeleton>
          </InfiniteScroll>
        </div>

      </div>
    )
  }

  renderReceiveTodoItems = () => (
    <div className='receive-content-root'>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        ref={el => {
          this.todoTab = el
        }}
        loadMore={this.loadTodoList.bind(this, undefined)}
        hasMore={this.props.homeState.receiveState.hasMore1}
        loader={<LoadingMore/>}
        threshold={1}
        useWindow={false}>
        <Skeleton loading={this.state.isReceiveTodoLoading} active
                  paragraph={{ rows: 4 }}>
          <List split={false}
                dataSource={this.props.homeState.receiveState.listData}
                renderItem={(item, index) => (
                  <ApprovalItem approval={item}
                                type={1}
                                onItemClick={this.onReceiveItemClick.bind(this)}
                                index={index}/>
                )}/>
        </Skeleton>
      </InfiniteScroll>
    </div>
  )

  renderReceiveDoneItems = () => (
    <div className='receive-content-root'>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        ref={el => {
          this.doneTab = el
        }}
        loadMore={this.loadDoneList.bind(this, undefined)}
        hasMore={this.props.homeState.receiveState.hasMore2}
        loader={<LoadingMore/>}
        threshold={1}
        useWindow={false}>
        <Skeleton loading={this.state.isReceiveDoneLoading} active
                  paragraph={{ rows: 4 }}>
          <List split={false}
                dataSource={this.props.homeState.receiveState.listData2}
                renderItem={(item, index) => (
                  <ApprovalItem approval={item}
                                type={2}
                                onItemClick={this.onReceiveItemClick.bind(this)}
                                index={index}/>
                )}/>
        </Skeleton>
      </InfiniteScroll>
    </div>
  )

  getNewMenu = () => {
    const { homeState } = this.props
    let newMenu = []
    if (!isObjEmpty(homeState.newState.newMenuList)) {
      homeState.newState.newMenuList.
        forEach((groupItem, groupIndex) => {
          if (groupIndex !== 0) {
            newMenu.push(<div className='gray-line'></div>)
          }
          newMenu.push(<MenuGroup groupIcon={groupItem.groupIcon}
                                  groupText={groupItem.st_name}/>)

          const funcList = groupItem.serves
          if (!isObjEmpty(funcList)) {
            let newFuncs = []
            funcList.forEach((funcItem, funcIndex) => {
              newFuncs.push(<FuncItem funcObj={funcItem}
                                      onFuncClick={this.onFuncClick}/>)
            })
            newMenu.push(<div style={{ background: 'white' }}>{newFuncs}</div>)
          }
        })
    }
    return newMenu
  }

  searchSubmit = (type, value) => {
    if (type === 0) {
      const { isReceiveTodoLoading, isReceiveDoneLoading } = this.state
      this.setState({
        receiveKey: value,
      })
      clearReceiveState({
        searchKey: value,
        tabIndex: this.props.homeState.receiveState.tabIndex,
      })()
      // this.mySwiper.slideTo(0, 0, false)
      if (!isReceiveTodoLoading) {
        this.setState({
          isReceiveTodoLoading: true,
        })
        mTodoIndex = 0
        this.loadTodoList(value)
      }
      if (!isReceiveDoneLoading) {
        this.setState({
          isReceiveDoneLoading: true,
        })
        mDoneIndex = 0
        this.loadDoneList(value)
      }
    } else if (type === 1) {
      const { isSendLoading } = this.state
      this.setState({
        sendKey: value,
      })
      clearSendState({
        searchKey: value,
      })()
      if (!isSendLoading) {
        this.setState({
          isSendLoading: true,
        })
        mSendIndex = 0
        this.loadSendList(value)
      }
    }
  }

  onFuncClick = (obj) => {
    this.cacheScrollState()
    this.props.history.push('/approvalAdd/' + obj.sv_caller + '/' + mMaster)
  }

  onReceiveItemClick = (index, approval) => {
    this.cacheScrollState()
    saveReceiveState({
      itemIndex: index,
    })()
    let jp_form = approval.JP_FORM
    let currentmaster = approval.CURRENTMASTER
    if (!isObjEmpty(jp_form) && !isObjEmpty(currentmaster) &&
      (jp_form.indexOf(currentmaster) != -1)) {

    } else {
      currentmaster = mMaster
    }
    let type = 0
    if (this.props.homeState.receiveState.tabIndex === 1) {
      type = 1
    }
    this.props.history.push('/approval/%7B%22' +
      'master%22%3A%22' + currentmaster
      + '%22%2C%22nodeId%22%3A' + approval.JP_NODEID
      + '%2C%22type%22%3A' + type
      + '%2C%22baseUrl%22%3A%22' + encodeURIComponent(mBaseUrl)
      + '%22%7D')
  }

  onSendItemClick = (index, approval) => {
    this.cacheScrollState()
    let jp_form = approval.JP_FORM
    let currentmaster = approval.CURRENTMASTER
    if (!isObjEmpty(jp_form) && !isObjEmpty(currentmaster) &&
      (jp_form.indexOf(currentmaster) != -1)) {

    } else {
      currentmaster = mMaster
    }
    this.props.history.push('/approval/%7B%22' +
      'master%22%3A%22' + currentmaster
      + '%22%2C%22nodeId%22%3A' + approval.JP_NODEID
      + '%2C%22type%22%3A' + 2
      + '%2C%22baseUrl%22%3A%22' + encodeURIComponent(mBaseUrl)
      + '%22%7D')
  }

  cacheScrollState () {
    saveNewState({
      scrollTop: ReactDOM.findDOMNode(this.newList).parentNode.scrollTop,
    })()
    saveReceiveState({
      scrollTop: ReactDOM.findDOMNode(this.todoTab).parentNode.scrollTop,
      scrollTop2: ReactDOM.findDOMNode(this.doneTab).parentNode.scrollTop,
    })()
    saveSendState({
      scrollTop: ReactDOM.findDOMNode(this.sendList).parentNode.scrollTop,
    })()
  }

  getNewMenuData = () => {
    this.setState({
      isNewMenuLoading: true,
    })

    fetchGet(mBaseUrl + '/api/serve/mainPage/getServices.action', {
      kind: 'appweb',
    }).then(response => {
      this.setState({
        isNewMenuLoading: false,
      })
      let configs = response.configs

      if (isObjEmpty(configs)) {
        message.warn('菜单数据为空')
      } else {
        saveNewState({
          newMenuList: configs,
        })()
      }
    }).catch(error => {
      this.setState({
        isNewMenuLoading: false,
      })
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('菜单数据获取失败')
      }
    })
  }

  loadTodoList = (keyword) => {
    let { homeState: { receiveState } } = this.props
    let { listData } = receiveState
    if (isObjEmpty(listData)) {
      mTodoIndex = 0
    }
    mTodoIndex++
    if (!this.state.isReceiveTodoLoading) {
      this.setState({
        isReceiveTodoRefresh: true,
      })
    }

    if (mTodoIndex === 1) {
      listData.length = 0
    }

    fetchGet(mBaseUrl + '/common/desktop/process/uapproval/toDo.action', {
      pageSize: mPageSize,
      page: mTodoIndex,
      keyword: !isObjNull(keyword) ? keyword : receiveState.searchKey,
    }).then(response => {
      this.setState({
        isReceiveTodoLoading: false,
        isReceiveTodoRefresh: false,
      })
      if (response && !isObjEmpty(response.data)) {
        listData = listData.concat(response.data)
      } else {
        if (mTodoIndex > 1) {
          mTodoIndex--
        }
      }
      saveReceiveState({
        hasMore1: !(isObjNull(response.data)
          || response.data.length < mPageSize),
        listData,
        pageIndex: mTodoIndex,
        todoCount: getIntValue(response, 'totalCount'),
      })()
    }).catch(error => {
      if (mTodoIndex > 1) {
        mTodoIndex--
      }
      saveReceiveState({
        hasMore1: false,
        listData,
        pageIndex: mTodoIndex,
      })()
      this.setState({
        isReceiveTodoLoading: false,
        isReceiveTodoRefresh: false,
      })
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('待审批列表请求异常')
      }
    })
  }

  loadDoneList = (keyword) => {
    let { homeState: { receiveState } } = this.props
    let { listData2 } = receiveState
    if (isObjEmpty(listData2)) {
      mDoneIndex = 0
    }
    mDoneIndex++
    if (!this.state.isReceiveDoneLoading) {
      this.setState({
        isReceiveDoneRefresh: true,
      })
    }

    if (mDoneIndex === 1) {
      listData2.length = 0
    }

    fetchGet(mBaseUrl + '/common/desktop/process/uapproval/alreadyDo.action', {
      pageSize: mPageSize,
      page: mDoneIndex,
      keyword: !isObjNull(keyword) ? keyword : receiveState.searchKey,
      isMobile: 1,
      _do: 1,
    }).then(response => {
      this.setState({
        isReceiveDoneLoading: false,
        isReceiveDoneRefresh: false,
      })
      if (response && !isObjEmpty(response.data)) {
        listData2 = listData2.concat(response.data)
      } else {
        if (mDoneIndex > 1) {
          mDoneIndex--
        }
      }
      saveReceiveState({
        hasMore2: !(isObjNull(response.data)
          || response.data.length < mPageSize),
        listData2,
        pageIndex: mDoneIndex,
      })()
    }).catch(error => {
      if (mDoneIndex > 1) {
        mDoneIndex--
      }
      saveReceiveState({
        hasMore2: false,
        listData2,
        pageIndex: mDoneIndex,
      })()
      this.setState({
        isReceiveDoneLoading: false,
        isReceiveDoneRefresh: false,
      })
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('已审批列表请求异常')
      }
    })
  }

  loadSendList = (keyword) => {
    let { homeState: { sendState } } = this.props
    let { sendList } = sendState
    if (isObjEmpty(sendList)) {
      mSendIndex = 0
    }
    mSendIndex++
    if (!this.state.isSendLoading) {
      this.setState({
        isSendRefresh: true,
      })
    }

    if (mSendIndex === 1) {
      sendList.length = 0
    }

    fetchGet(
      mBaseUrl + '/common/desktop/process/uapproval/alreadyLaunch.action',
      {
        pageSize: mPageSize,
        page: mSendIndex,
        keyword: !isObjNull(keyword) ? keyword : sendState.searchKey,
        isMobile: 1,
        _do: 1,
      }).then(response => {
      this.setState({
        isSendLoading: false,
        isSendRefresh: false,
      })
      if (response && !isObjEmpty(response.data)) {
        sendList = sendList.concat(response.data)
      } else {
        if (mSendIndex > 1) {
          mSendIndex--
        }
      }
      saveSendState({
        sendHasMore: !(isObjNull(response.data)
          || response.data.length < mPageSize),
        sendList,
        pageIndex: mSendIndex,
      })()
    }).catch(error => {
      if (mSendIndex > 1) {
        mSendIndex--
      }
      saveSendState({
        sendHasMore: false,
        sendList,
        pageIndex: mSendIndex,
      })()
      this.setState({
        isSendLoading: false,
        isSendRefresh: false,
      })
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('列表请求异常')
      }
    })
  }
}

class MenuGroup extends Component {
  render () {
    return (
      <div className='newMenu-group-layout'>
        {/*<img className='newMenu-group-icon' src={this.props.groupIcon}/>*/}
        <span className='newMenu-group-text'>{this.props.groupText}</span>
      </div>
    )
  }
}

class FuncItem extends Component {
  render () {
    const { funcObj } = this.props

    let platform = funcObj.sv_logourl.platform
    let imgUrl = funcObj.sv_logourl.mobile || LocalImgs[platform] || ''

    return (
      isObjEmpty(funcObj) ?
        <div></div> :
        <div className='newMenu-func-root' onClick={this.onFuncClick}>
          <div className='newMenu-func-layout'>
            <img className='newMenu-func-icon'
                 src={imgUrl}/>
            <span className='newMenu-func-text'>{funcObj.sv_name}</span>
          </div>
        </div>
    )
  }

  onFuncClick = () => {
    if (this.props.onFuncClick) {
      this.props.onFuncClick(this.props.funcObj)
    }
  }
}

let mapStateToProps = (state) => ({
  homeState: { ...state.redHomeState },
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalHome)

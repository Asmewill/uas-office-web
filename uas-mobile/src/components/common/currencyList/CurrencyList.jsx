/**
 * Created by RaoMeng on 2020/11/24
 * Desc: 通用列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyListItem
  from './CurrencyListItem'
import {
  SearchBar,
  PullToRefresh,
  ListView,
  Drawer,
  Button, Toast,
} from 'antd-mobile'
import './currency-list.less'
import UasIcon from '../../../configs/iconfont.conig'
import LoadingMore from '../loading/LoadingMore'
import ReactDOM from 'react-dom'
import { Prompt } from 'react-router-dom'
import { isObjEmpty, isObjNull } from '../../../utils/common/common.util'
import CurrencyTabItem
  from './CurrencyTabItem'
import { saveListState } from '../../../redux/actions/listState'
import { LIST_PAGE_SIZE } from '../../../configs/constans.config'
import CurrencyDetail from '../currencyDetail/CurrencyDetail'
import { refreshFormState } from '../../../redux/actions/formState'
import {
  getBillGroup,
  getFormAndGrid,
} from '../../../utils/common/form.request'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { Empty, message } from 'antd'

class CurrencyList extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: true,
      hasNextPage: true,
      isEmpty: false,
      height: document.documentElement.clientHeight,
      listDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount () {
    this.props.onRef && this.props.onRef(this)
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop
    this.setState({
      height: hei,
      refreshing: false,
      filterOpen: false,
      isEmpty: false,
      listDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    })
    setTimeout(() => {
      if (ReactDOM.findDOMNode(this.lv)) {
        this.setState({
          height: document.documentElement.clientHeight -
            ReactDOM.findDOMNode(this.lv).offsetTop,
        })
      }
    }, 400)

    const {
      tabUrl,
      listUrl,
      searchUrl,
      listState: { tabList, listData },
      formState: { filterGroupList },
    } = this.props

    if (isObjEmpty(tabList)
      && isObjEmpty(listData)
      && !isObjNull(tabUrl)) {
      this.requestTab()
    } else if (isObjEmpty(filterGroupList)
      && isObjEmpty(listData)
      && !isObjNull(searchUrl)) {
      this.requestSearchConfig()
    } else if (isObjEmpty(listData) && !isObjNull(listUrl)) {
      saveListState({
        pageIndex: 0,
      })
      this.requestList()
    } else {
      this.setState({
        hasNextPage: listData.length >= LIST_PAGE_SIZE,
        isEmpty: false,
      })
      this.recoveryScroll()
    }

  }

  componentWillUnmount () {
    Toast.hide()
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    // this.forceUpdate()
    return true
  }

  render () {
    const {
      listState: {
        tabList,
        tabSelect,
        listData,
        pageIndex,
        searchValue,
      },
      rowCount,
      addAble,
      filterAble,
    } = this.props
    const {
      listDataSource,
      height,
      filterOpen,
      hasNextPage,
      isEmpty,
    } = this.state

    const refreshLayout = this.getRefreshLayout()
    const filterLayout = this.getFilterLayout()

    const tabItems = []
    if (!isObjEmpty(tabList) && tabList.length > 1) {
      tabList.forEach((item, index) => {
        tabItems.push(<CurrencyTabItem
          tabObj={item}
          isSelect={tabSelect === index}
          tabIndex={index}
          key={'tab' + index}
          onTabSelect={this.onTabSelect.bind(this)}
        />)
      })
    }
    return (
      <div className='currency-list-root'>
        <Prompt message={this.handlePrompt.bind(this)}/>
        <Drawer
          sidebar={filterLayout}
          onOpenChange={this.onFilterOpen}
          open={filterOpen}
          position={'right'}
          className='currency-list-content-filter-root'
        />
        <div className='currency-list-search-root'>
          <SearchBar
            className='currency-list-search-search'
            placeholder={'搜索'}
            value={searchValue}
            onSubmit={this.onSearchSubmit}
            onChange={this.onSearchChange}
            onCancel={this.onSearchCancel}
          />
          {
            filterAble && <UasIcon
              className='currency-list-search-filter'
              type={'uas-search-filter'}
              onClick={this.onFilterOpen}/>
          }

        </div>
        <div className='currency-list-tab-root'>
          {tabItems}
        </div>
        <ListView
          ref={el => this.lv = el}
          dataSource={listDataSource.cloneWithRows(listData)}
          initialListSize={(pageIndex + 1) * LIST_PAGE_SIZE}
          renderFooter={() => {
            return (
              hasNextPage ? <LoadingMore/> :
                (isEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : '')
            )
          }}
          renderRow={(rowData, sectionID, rowID) => {
            return <CurrencyListItem
              rowCount={rowCount}
              rowData={rowData}
              onItemClick={this.onItemClick}
            />
          }}
          style={{
            height,
          }}
          pullToRefresh={refreshLayout}
          onEndReachedThreshold={10}
          // onEndReached={hasNextPage ? this.requestList : null}
          onEndReached={this.requestList}
          pageSize={LIST_PAGE_SIZE}
        />
        {this.props.children}
        {
          addAble && <UasIcon
            type={'uas-add-doc'}
            className='com-hover-button'
            onClick={this.onDocAdd}
          />
        }
      </div>
    )
  }

  recoveryScroll = () => {
    const { listState: { scrollTop } } = this.props
    ReactDOM.findDOMNode(this.lv).scrollTop = scrollTop
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
        saveListState({
          pageIndex: 0,
          listData: [],
        })
        this.requestList()
      }}
    />
  }

  getFilterLayout = () => {
    const {
      params, formState: { filterGroupList },
    } = this.props
    return (
      <div
        className='currency-list-content-filter-content'>
        <CurrencyDetail
          onRef={ref => this.cd = ref}
          caller={params.caller}
          id={0}
          formData={filterGroupList}
          customAction
        />
        <div className='currency-list-content-filter-func'>
          <Button
            className='currency-list-content-filter-func-button'
            type="primary"
            onClick={this.onFilterCommit.bind(this)}
            inline>确认</Button>
          <Button
            className='currency-list-content-filter-func-button'
            type="ghost"
            onClick={this.onFilterOpen}
            inline>取消</Button>
        </div>
      </div>)
  }

  onTabSelect = (tabIndex) => {
    saveListState({
      pageIndex: 0,
      tabSelect: tabIndex,
      listData: [],
    })
    this.setState({
      isEmpty: false,
      hasNextPage: true,
    })
    //Todo 解决redux修改数据不同步问题
    setTimeout(() => {
      this.requestList()
    }, 0)
  }

  /**
   * 获取应用状态列表
   */
  requestTab () {
    const { tabUrl, params } = this.props
    Toast.loading('', 0)
    fetchPostObj(tabUrl, params).then(response => {
      Toast.hide()
      if (!isObjEmpty(response, response.data, response.data.list)) {
        saveListState({
          tabList: response.data.list,
          tabSelect: 0,
        })
      }
      const {
        searchUrl,
        formState: { filterGroupList },
      } = this.props
      if (isObjEmpty(filterGroupList)
        && !isObjNull(searchUrl)) {
        this.requestSearchConfig()
      } else {
        this.requestList()
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('应用状态获取失败')
      }
    })
  }

  /**
   * 获取单据列表
   * @param code
   */
  requestList = (extraParams) => {
    let {
      listUrl,
      params,
      listState: { listData, pageIndex, oldSearch, tabList, tabSelect },
      formState: { filterGroupList },
    } = this.props

    pageIndex++
    if (pageIndex === 1) {
      listData = []
    }
    return fetchPostObj(listUrl, {
      code: tabList ? tabList[tabSelect].CODE : '',
      pageIndex,
      pageSize: LIST_PAGE_SIZE,
      keyWords: oldSearch,
      filters: isObjEmpty(filterGroupList) ? '' : getFormAndGrid(
        filterGroupList).formFields,
      ...params,
      ...extraParams,
    }).then(response => {
      if (!isObjEmpty(response, response.data, response.data.list)) {
        listData = listData.concat(response.data.list)
        this.setState({
          hasNextPage: response.data.list.length >= LIST_PAGE_SIZE,
          isEmpty: false,
        })
      } else {
        pageIndex--
        Toast.show('数据为空', 2, false)
        this.setState({
          hasNextPage: false,
          isEmpty: pageIndex === 0,
        })
      }
      this.setState({
        refreshing: false,
      })
      saveListState({
        listData,
        pageIndex,
      })
    }).catch(error => {
      pageIndex--
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('数据获取失败')
      }
      this.setState({
        refreshing: false,
      })
      saveListState({
        listData,
        pageIndex,
      })
    })
  }

  /**
   * 获取筛选条件配置
   */
  requestSearchConfig = () => {
    const { searchUrl, params } = this.props
    fetchPostObj(searchUrl, params).then(response => {
      let formAndGrid = undefined
      if (!isObjEmpty(response, response.data, response.data.list)) {
        const formGroup = {
          groupTitle: '筛选条件',
          isForm: true,
          fieldList: response.data.list,
        }
        const billGroup = getBillGroup(formGroup, 0)
        const billGroupList = [billGroup]
        refreshFormState({
          filterGroupList: billGroupList,
        })
        formAndGrid = getFormAndGrid(billGroupList)
      }

      this.requestList(formAndGrid && {
        filters: formAndGrid.formFields,
      })
    }).catch(error => {

    })
  }

  onItemClick = (rowData) => {
    saveListState({
      scrollTop: ReactDOM.findDOMNode(this.lv).scrollTop,
    })
    const { onItemClick } = this.props
    onItemClick && onItemClick(rowData)
  }

  onDocAdd = () => {
    saveListState({
      scrollTop: ReactDOM.findDOMNode(this.lv).scrollTop,
    })
    const { onDocAdd } = this.props
    onDocAdd && onDocAdd()
  }

  handlePrompt = (location) => {
    const { handlePrompt } = this.props
    if (this.state.filterOpen) {
      this.setState({
        filterOpen: !this.state.filterOpen,
      })
      return false
    } else if (handlePrompt) {
      return handlePrompt()
    } else {
      return true
    }
  }

  onFilterOpen = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    })
  }

  onFilterCommit = () => {
    const filterGroupList = this.cd && this.cd.state.billGroupList
    let formAndGrid = getFormAndGrid(filterGroupList)
    if (!isObjNull(formAndGrid)) {
      saveListState({
        pageIndex: 0,
        listData: [],
      })
      this.setState({
        isEmpty: false,
        hasNextPage: true,
      })
      setTimeout(() => {
        this.requestList({
          filters: formAndGrid.formFields,
        })
      }, 0)
      this.setState({
        filterOpen: !this.state.filterOpen,
      })
    }
    refreshFormState({
      filterGroupList: filterGroupList,
    })
  }

  onSearchChange = (val) => {
    saveListState({
      searchValue: val,
    })
  }

  onSearchSubmit = (val) => {
    this.searchSubmit(val)
  }

  onSearchCancel = (val) => {
    saveListState({
      searchValue: '',
    })
    const { oldSearch } = this.props.listState
    if (!isObjEmpty(oldSearch)) {
      this.searchSubmit('')
    }
  }

  searchSubmit = (keyword) => {
    saveListState({
      pageIndex: 0,
      listData: [],
      oldSearch: keyword,
    })
    this.setState({
      isEmpty: false,
      hasNextPage: true,
    })
    //Todo 解决redux修改数据不同步问题
    setTimeout(() => {
      this.requestList()
    }, 0)
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
  formState: state.formState,
})

export default connect(mapStateToProps)(CurrencyList)

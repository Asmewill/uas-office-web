/**
 * Created by RaoMeng on 2020/12/3
 * Desc: 报表搜索
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import './report.less'
import { PullToRefresh, SearchBar } from 'antd-mobile'
import { requestReportFunc } from '../../../utils/private/report.util'
import { isObjEmpty, strContain } from '../../../utils/common/common.util'
import ReportSearchItem
  from '../../../components/private/report/ReportSearchItem'
import { clearListState } from '../../../redux/actions/listState'
import { clearFormState } from '../../../redux/actions/formState'

class ReportSearch extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: false,
      reportSearchList: [],
    }
  }

  componentDidMount () {
    document.title = '报表搜索'
    clearListState()
    clearFormState()

    this.searchBar.focus()

    const { reportState } = this.props
    this.allReportFuncList = []
    if (!isObjEmpty(reportState, reportState.reportFuncGroupList)) {
      reportState.reportFuncGroupList.forEach((groupItem, index) => {
        if (!isObjEmpty(groupItem, groupItem.funcList)) {
          this.allReportFuncList = this.allReportFuncList.concat(
            groupItem.funcList)
        }
      })
    }
    this.setState({
      reportSearchList: this.allReportFuncList,
    })
  }

  componentWillUnmount () {

  }

  render () {
    const { refreshing, reportSearchList } = this.state
    const funcGroupItems = []
    if (!isObjEmpty(reportSearchList)) {
      reportSearchList.forEach((item, index) => {
        funcGroupItems.push(<ReportSearchItem
          reportObj={item}
          onSubItemClick={this.onSubItemClick.bind(this)}
          key={'report' + index}/>)
      })
    }

    return (
      <div
        className='report-search-root'>
        <SearchBar
          ref={el => this.searchBar = el}
          onChange={this.onSearchChange}
          placeholder={'搜索'}/>
        <PullToRefresh
          className='report-search-content'
          refreshing={refreshing}
          onRefresh={this.refreshFunc}>
          {funcGroupItems}
        </PullToRefresh>
      </div>
    )
  }

  onSearchChange = (value) => {
    let searchResultList = []
    if (!isObjEmpty(this.allReportFuncList)) {
      if (isObjEmpty(value)) {
        searchResultList = this.allReportFuncList
      } else {
        this.allReportFuncList.forEach(item => {
          if (strContain(item.name, value)) {
            searchResultList.push(item)
          }
        })
      }
    }
    this.setState({
      reportSearchList: searchResultList,
    })
  }

  refreshFunc = () => {
    this.setState({
      refreshing: true,
    })
    requestReportFunc().then(response => {
      this.setState({
        refreshing: false,
      })
    }).catch(error => {
      this.setState({
        refreshing: false,
      })
    })
  }

  onSubItemClick = (reportObj) => {
    this.props.history.push(
      '/reportList/' + reportObj.caller + '/' + reportObj.id + '/' +
      reportObj.name)
  }
}

let mapStateToProps = (state) => ({
  reportState: state.reportState,
})

export default connect(mapStateToProps)(ReportSearch)

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 报表
 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import FuncGroup from '../../../components/common/func/FuncGroup'
import { isObjEmpty } from '../../../utils/common/common.util'
import { SearchBar, PullToRefresh } from 'antd-mobile'
import { requestReportFunc } from '../../../utils/private/report.util'
import { Empty } from 'antd'
import PageLoading from '../../../components/common/loading/PageLoading'

class ReportRoot extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: false,
    }
  }

  componentDidMount () {
    requestReportFunc()
  }

  componentWillUnmount () {

  }

  render () {
    const { reportState: { reportFuncGroupList, recentUse, reportEmpty } } = this.props
    let funcGroupItems = []
    if (!isObjEmpty(recentUse)) {
      const recentItem = {
        groupTitle: '最近查询',
        funcList: recentUse,
      }
      funcGroupItems.push(
        <FuncGroup
          funcGroup={recentItem}
          card
          lineCount={2}
          key={'reportRecentUse'}
        />,
      )
    }
    if (!isObjEmpty(reportFuncGroupList)) {
      reportFuncGroupList.forEach((item, index) => {
        funcGroupItems.push(
          <FuncGroup
            funcGroup={item}
            // line
            card
            lineCount={2}
            key={'reportFuncGroup' + index}
          />,
        )
      })
    }

    return (
      <div className='report-root'>
        <div
          onClick={this.onSearchClick}>
          <SearchBar
            disabled
            placeholder={'搜索'}/>
        </div>
        <PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.refreshFunc}
          className='report-func-root'
        >
          {funcGroupItems.length > 0 ?
            funcGroupItems :
            reportEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
              this.state.refreshing ? '' : <PageLoading/>}
        </PullToRefresh>
      </div>
    )
  }

  onSearchClick = () => {
    this.props.history.push('/reportSearch')
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
}

let mapStateToProps = (state) => ({
  reportState: state.reportState,
})

export default connect(mapStateToProps)(withRouter(ReportRoot))

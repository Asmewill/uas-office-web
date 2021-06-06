import React, { Component } from 'react'
import { connect } from 'react-redux'
import './home-page.less'
import { TabBar } from 'antd-mobile'
import UasIcon from '../../../configs/iconfont.conig'
import {
  freshHomeState,
} from '../../../redux/actions/homeState'
import MainRoot from './MainRoot'
import ReportRoot from './ReportRoot'
import DocRoot from './DocRoot'
import MineRoot from './MineRoot'
import { clearListState } from '../../../redux/actions/listState'
import { requestUserInfo } from '../../../utils/private/user.util'
import { clearFormState } from '../../../redux/actions/formState'
import { clearScheduleState } from '../../../redux/actions/scheduleState'
import { forceVisible } from 'react-lazyload'
import { clearApprovalHomeState } from '../../../redux/actions/approvalState'
import introJs from 'intro.js'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 主页
 */

class HomePage extends Component {

  constructor () {
    super()

    this.state = {
      tabBarHidden: false,//底部TabBar是否隐藏
    }
  }

  componentDidMount () {
    document.title = 'UAS系统'
    clearListState()
    clearFormState()
    clearScheduleState()
    clearApprovalHomeState()

    requestUserInfo()

    // introJs('.home-root')
    //   .setOptions({
    //     prevLabel: '上一步',
    //     nextLabel: '下一步',
    //     skipLabel: '跳过',
    //     doneLabel: '结束',
    //     tooltipClass: 'customTooltip',
    //     // showStepNumbers: true,
    //     exitOnOverlayClick: false,
    //     exitOnEsc: false,
    //     // showProgress: true,
    //     scrollToElement: true,
    //     steps: [
    //       {
    //         element: document.querySelectorAll('.am-tab-bar-tab')[0],
    //         title: '首页',
    //         intro: '首页首页首页首页首页首页首页首页首页首页首页首页首页首页首页首页',
    //         position: 'auto',
    //       },
    //       {
    //         element: document.querySelectorAll('.am-tab-bar-tab')[1],
    //         title: '报表',
    //         intro: '报表报表报表报表报表报表报表报表报表报表报表报表报表报表报表',
    //         position: 'auto',
    //       },
    //       {
    //         element: document.querySelectorAll('.am-tab-bar-tab')[2],
    //         title: '应用',
    //         intro: '应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用应用',
    //         position: 'auto',
    //       },
    //       {
    //         element: document.querySelectorAll('.am-tab-bar-tab')[3],
    //         title: '我的',
    //         intro: '我的我的我的我的我的我的我的我的我的我的我的',
    //         position: 'auto',
    //       },
    //     ],
    //   }).start()
  }

  componentWillUnmount () {

  }

  render () {
    const { tabBarHidden } = this.state

    return (
      <div className='home-root'>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          prerenderingSiblingsNumber={0}
          hidden={tabBarHidden}
        >
          {this.getMainTab()}
          {this.getReportTab()}
          {this.getDocTab()}
          {this.getMineTab()}
        </TabBar>
      </div>
    )
  }

  getMainTab = () => {
    return (
      <TabBar.Item
        title="首页"
        key="Main"
        icon={<UasIcon type="uas-main-normal"/>}
        selectedIcon={<UasIcon type="uas-main-select"/>}
        selected={this.props.homeState.selectedTab === 0}
        // badge={this.props.homeState.mainCount}
        badge={''}
        dot={false}
        onPress={this.onMainTabSelected}
      >
        {this.renderMainTab()}
      </TabBar.Item>
    )
  }

  getReportTab = () => {
    return (
      <TabBar.Item
        title="报表"
        key="Report"
        icon={<UasIcon type="uas-report-normal"/>}
        selectedIcon={<UasIcon type="uas-report-select"/>}
        selected={this.props.homeState.selectedTab === 1}
        badge={''}
        dot={false}
        onPress={this.onReportTabSelected}
      >
        {this.renderReportTab()}
      </TabBar.Item>
    )
  }

  getDocTab = () => {
    return (
      <TabBar.Item
        title="应用"
        key="Doc"
        icon={<UasIcon type="uas-doc-normal"/>}
        selectedIcon={<UasIcon type="uas-doc-select"/>}
        selected={this.props.homeState.selectedTab === 2}
        badge={''}
        dot={false}
        onPress={this.onDocTabSelected}
      >
        {this.renderDocTab()}
      </TabBar.Item>
    )
  }

  getMineTab = () => {
    return (
      <TabBar.Item
        title="我的"
        key="Mine"
        icon={<UasIcon type="uas-mine-normal"/>}
        selectedIcon={<UasIcon type="uas-mine-select"/>}
        selected={this.props.homeState.selectedTab === 3}
        badge={''}
        dot={false}
        onPress={this.onMineTabSelected}
      >
        {this.renderMineTab()}
      </TabBar.Item>
    )
  }

  /**
   * 首页布局
   * @returns {*}
   */
  renderMainTab () {
    return (
      <MainRoot/>
    )
  }

  /**
   * 报表布局
   * @returns {*}
   */
  renderReportTab () {
    return (
      <ReportRoot/>
    )
  }

  /**
   * 应用布局
   * @returns {*}
   */
  renderDocTab () {
    return (
      <DocRoot/>
    )
  }

  /**
   * 我的布局
   * @returns {*}
   */
  renderMineTab () {
    return (
      <MineRoot/>
    )
  }

  /**
   * 切换首页
   */
  onMainTabSelected = () => {
    //强制图表显示
    forceVisible()
    freshHomeState({
      selectedTab: 0,
    })
  }

  /**
   * 切换报表
   */
  onReportTabSelected = () => {

    freshHomeState({
      selectedTab: 1,
    })
  }

  /**
   * 切换应用
   */
  onDocTabSelected = () => {

    freshHomeState({
      selectedTab: 2,
    })
  }

  /**
   * 切换我的
   */
  onMineTabSelected = () => {

    freshHomeState({
      selectedTab: 3,
    })
  }
}

let mapStateToProps = (state) => ({
  homeState: state.homeState,
})

export default connect(mapStateToProps)(HomePage)

/**
 * Created by hujs on 2020/11/10
 * Desc: 首页头部
 */

import React, { Component } from 'react'
import FuncItem from '../func/FuncItem'
import { withRouter } from 'react-router-dom'
import { _baseURL, API } from '../../../configs/api.config'
import { connect } from 'react-redux'
import { refreshMainState } from '../../../redux/actions/mainState'
import { freshHomeState } from '../../../redux/actions/homeState'

class MainHeader extends Component {

  constructor () {
    super()

    this.state = {
      homeHeaderIcon: [
        {
          'name': '我的日程',
          countUrl: API.APPCOMMON_COUNT + 'dailyTask.action',
          icon: 'uas-home-schedule',
        },
        {
          'name': '待审批',
          countUrl: API.APPCOMMON_COUNT + 'processToDo.action',
          icon: 'uas-home-approval',
        },
        {
          'name': '我的待办',
          countUrl: API.APPCOMMON_COUNT + 'taskToDo.action',
          icon: 'uas-home-task',
        },
        {
          'name': '我的订阅',
          countUrl: API.APPCOMMON_COUNT + 'subscribe.action',
          icon: 'uas-home-subscribe',
        },
      ],
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { mainState } = this.props
    let { homeHeaderIcon } = this.state
    homeHeaderIcon[0].sup = mainState.dailyCount
    homeHeaderIcon[1].sup = mainState.processCount
    homeHeaderIcon[2].sup = mainState.taskCount
    homeHeaderIcon[3].sup = mainState.subscribeCount

    let homeHeaderList = []
    homeHeaderIcon.forEach((item, index) => {
      homeHeaderList.push(
        <FuncItem
          supAble
          funcObj={item}
          supValue={item.sup}
          onFuncClick={this.onFuncClick.bind(this)}
          onFuncDataChange={this.onFuncDataChange.bind(this)}
          key={index}/>,
      )
    })

    return (
      <div>
        {homeHeaderList}
      </div>
    )
  }

  onFuncClick = (funcObj) => {
    //点击图标触发
    if (funcObj.name === '我的日程') {
      this.props.history.push('/schedulePage')
    } else if (funcObj.name === '我的待办') {
      this.props.history.push('/taskTodo')
    } else if (funcObj.name === '我的订阅') {
      this.props.history.push('/subscribeList')
    } else if (funcObj.name === '待审批') {
      this.props.history.push(
        '/approvalHome/' + this.props.userState.accountCode)
    }
  }

  onFuncDataChange = (funcObj) => {
    const count = funcObj.sup
    if (funcObj.name === '我的日程') {
      refreshMainState({
        dailyCount: count,
      })
    } else if (funcObj.name === '待审批') {
      refreshMainState({
        processCount: count,
      })
    } else if (funcObj.name === '我的待办') {
      refreshMainState({
        taskCount: count,
      })
    } else if (funcObj.name === '我的订阅') {
      refreshMainState({
        subscribeCount: count,
      })
    }
    const { mainState } = this.props
    const dailyCount = parseInt(mainState.dailyCount)
    const processCount = parseInt(mainState.processCount)
    const taskCount = parseInt(mainState.taskCount)
    const subscribeCount = parseInt(mainState.subscribeCount)

    freshHomeState({
      mainCount: dailyCount + processCount + taskCount + subscribeCount,
    })
  }
}

let mapStateToProps = (state) => ({
  mainState: state.mainState,
  userState: state.userState,
})

export default connect(mapStateToProps)(withRouter(MainHeader))

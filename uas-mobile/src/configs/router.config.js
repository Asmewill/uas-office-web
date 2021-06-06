import React from 'react'
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import { Modal } from 'antd-mobile'
import { connect } from 'react-redux'
import PageLoadable from '../components/common/pageLoad/PageLoadable'

/**
 * Created by RaoMeng on 2020/10/20
 * Desc: 全局路由配置
 */

/**************************************************公用**************************************************/
const PageNotFound = PageLoadable(
  import(/* webpackChunkName:'common' */'@/pages/common/PageNotFound'))
const AccessDenied = PageLoadable(
  import(/* webpackChunkName:'common' */'@/pages/common/AccessDenied'))
const UasEntry = PageLoadable(
  import(/* webpackChunkName:'common' */'@/pages/common/UasEntry'))
const MapSearch = PageLoadable(
  import(/* webpackChunkName:'common' */'@/components/common/map/MapSearch'))

/**************************************************主页**************************************************/
const HomePage = PageLoadable(
  import(/* webpackChunkName:'home' */'@/pages/private/homePage/HomePage'))

/**************************************************审批**************************************************/
const ApprovalHome = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/private/approval/pages/ApprovalHome'))
const ApprovalPage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/private/approval/pages/Approval'))
const ApprovalAdd = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/private/approval/pages/ApprovalAdd'))

/**************************************************日程**************************************************/
const SchedulePage = PageLoadable(
  import(/* webpackChunkName:'schedule' */'@/pages/private/schedulePage/SchedulePage'))
const ConferenceDetail = PageLoadable(
  import(/* webpackChunkName:'schedule' */'@/pages/private/schedulePage/ConferenceDetail'))

/**************************************************订阅**************************************************/
const SubscribeList = PageLoadable(
  import(/* webpackChunkName:'subscribe' */'@/pages/private/subscribe/SubscribeList'))
const SubscribeManage = PageLoadable(
  import(/* webpackChunkName:'subscribe' */'@/pages/private/subscribe/SubscribeManage'))
const SubscribeChart = PageLoadable(
  import(/* webpackChunkName:'subscribe' */'@/pages/private/subscribe/SubscribeChart'))

/**************************************************待办**************************************************/
const TaskTodo = PageLoadable(
  import(/* webpackChunkName:'tasktodo' */'@/pages/private/taskTodo/TaskTodo'))
const DailyTask = PageLoadable(
  import(/* webpackChunkName:'tasktodo' */'@/pages/private/taskTodo/DailyTask'))
const ProjectTask = PageLoadable(
  import(/* webpackChunkName:'tasktodo' */'@/pages/private/taskTodo/ProjectTask'))
const TaskTodoDetail = PageLoadable(
  import(/* webpackChunkName:'tasktodo' */'@/pages/private/taskTodo/TaskTodoDetail'))

/**************************************************报表**************************************************/
const ReportSearch = PageLoadable(
  import(/* webpackChunkName:'report' */'@/pages/private/report/ReportSearch'))
const ReportList = PageLoadable(
  import(/* webpackChunkName:'report' */'@/pages/private/report/ReportList'))

/**************************************************应用**************************************************/
const OftenFuncManage = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/oftenFunc/OftenFuncManage'))
const ServiceList = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/service/ServiceList'))
const ServiceDetail = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/service/ServiceDetail'))
const ServiceAdd = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/service/ServiceAdd'))

const AssessList = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/assess/AssessList'))
const AssessDetail = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/assess/AssessDetail'))

const WorkOutList = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/workOut/WorkOutList'))
const WorkOutAdd = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/workOut/WorkOutAdd'))
const WorkOutDetail = PageLoadable(
  import(/* webpackChunkName:'service' */'@/pages/private/workOut/WorkOutDetail'))

/*************************************************我的信息************************************************/
const ChangeAccount = PageLoadable(
  import(/* webpackChunkName:'mine' */'@/pages/private/mine/ChangeAccount'))

const ContactInfo = PageLoadable(
  import(/* webpackChunkName:'mine' */'@/pages/private/mine/ContactInfo'))

const UserFeedback = PageLoadable(
  import(/* webpackChunkName:'mine' */'@/pages/private/mine/UserFeedback'))

/**
 * 自定义页面返回事件拦截框
 * @param message
 * @param callback
 */
const getConfirmation = (message, callback) => {
  Modal.alert('提示', message, [
    {
      text: '取消', onPress: () => {
        callback(false)
      },
    },
    {
      text: '确定', onPress: () => {
        callback(true)
      },
    }])
}

class Routes extends React.Component {
  componentWillUnmount () {

  }

  render () {
    return <Router
      basename={(process.env.REACT_APP_ROUTER_BASE_NAME || '') + '/uasMobile'}
      getUserConfirmation={getConfirmation}>
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          {/***************************************通用*******************************************/}
          {/* 默认页面、404页面 */}
          <Route exact path='/' component={PageNotFound}/>
          {/*权限缺失页面*/}
          <Route exact path='/accessDenied' component={AccessDenied}/>
          {/*入口页面*/}
          <Route path={'/uasEntry'} component={UasEntry}/>
          {/*地图搜索*/}
          <Route path={'/mapSearch'} component={MapSearch}/>

          {/***************************************主页*******************************************/}
          {/*主页*/}
          <Route path='/homePage' component={HomePage}/>

          {/***************************************审批*******************************************/}
          {/*U审批首页*/}
          <Route path='/approvalHome/:type?'
                 component={ApprovalHome}/>
          {/*U审批详情页*/}
          <Route path='/approval/:paramsStr?' component={ApprovalPage}/>
          {/*U审批新增页面*/}
          <Route path='/approvalAdd/:caller/:master/:id?'
                 component={ApprovalAdd}/>

          {/***************************************日程*******************************************/}
          <Route path='/schedulePage' component={SchedulePage}/>
          {/* 会议详情 */}
          <Route path='/conferenceDetail/:id/:caller/:title?'
                 component={ConferenceDetail}/>

          {/***************************************订阅*******************************************/}
          {/*我的订阅*/}
          <Route path='/subscribeList' component={SubscribeList}/>
          {/*订阅管理*/}
          <Route path='/subscribeManage' component={SubscribeManage}/>
          {/* 订阅图表 */}
          <Route path='/subscribeChart/:id/:num_id/:ins_id'
                 component={SubscribeChart}/>

          {/***************************************待办******************************************/}
          {/*待办列表*/}
          <Route path='/taskTodo' component={TaskTodo}/>
          {/*日常任务*/}
          <Route path='/dailyTask/:type/:id' component={DailyTask}/>
          {/*项目任务*/}
          <Route path='/projectTask/:type/:id' component={ProjectTask}/>
          {/* 待办详情 */}
          <Route path='/taskTodoDetail/:id/:caller'
                 component={TaskTodoDetail}/>

          {/***************************************报表******************************************/}
          {/*报表搜索*/}
          <Route path='/reportSearch' component={ReportSearch}/>
          {/*报表数据列表*/}
          <Route path='/reportList/:caller/:id/:title?' component={ReportList}/>

          {/***************************************应用*******************************************/}
          {/*常用应用管理*/}
          <Route path='/oftenFuncManage' component={OftenFuncManage}/>
          {/*应用数据列表*/}
          <Route path='/serviceList/:readOnly/:caller/:title?'
                 component={ServiceList}/>
          {/*应用单据详情*/}
          <Route path='/serviceDetail/:id/:caller/:title?'
                 component={ServiceDetail}/>
          {/*应用单据新增*/}
          <Route path='/serviceAdd/:id/:caller/:title?'
                 component={ServiceAdd}/>

          {/*考核评估列表*/}
          <Route path='/assessList/:readOnly/:caller/:title?'
                 component={AssessList}/>
          {/*考核评估详情*/}
          <Route path='/assessDetail/:id/:caller/:title?'
                 component={AssessDetail}/>

          {/*外勤计划列表*/}
          <Route path='/workOutList/:readOnly/:caller/:title?'
                 component={WorkOutList}/>
          {/*新增外勤计划*/}
          <Route path='/workOutAdd/:caller'
                 component={WorkOutAdd}/>
          {/*新增外勤计划*/}
          <Route path='/workOutDetail/:id/:caller'
                 component={WorkOutDetail}/>

          {/*************************************我的信息*****************************************/}
          {/*切换账套列表*/}
          <Route path='/changeAccount' component={ChangeAccount}/>
          {/* 关于我们 */}
          <Route path='/contactInfo' component={ContactInfo}/>
          {/* 用户反馈 */}
          <Route path='/userFeedback' component={UserFeedback}/>

          {/*所有错误路由跳转页面*/}
          <Route render={() => (
            <Redirect to={'/'}/>
          )}/>
        </Switch>
      </div>
    </Router>
  }

  //Todo 登录管控
  loginControl = (component) => {
    //Todo 获取redux中缓存的登录数据，做相应管控逻辑
    let props = this.props
    let login = props.login
    if (login) {
      return <component {...props} />
    } else {
      return <Redirect to={{
        pathname: '/login',
        state: { from: props.location },
      }}/>
    }
  }

  //Todo 权限管控
  authorityControl = (component) => {
    //Todo 获取redux中缓存的权限信息，做相应管控逻辑
    // this.loginControl(component)

    let props = this.props
    let authority = props.authority
    if (authority) {
      return <component {...props} />
    } else {
      return <Redirect to={{
        pathname: '/accessDenied',
        state: { from: props.location },
      }}/>
    }
  }
}

// 从redux拿到全局信息，挂载到全局路由上。
// 可在全局路由做所需操作，如，权限管控，登录信息验证等
let mapStateToProps = (state) => ({
  //Todo 挂载相关信息，如登录信息，权限信息等
})
let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)




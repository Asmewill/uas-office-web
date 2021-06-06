import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import { Modal } from 'antd-mobile'
import BindPhone from '../pages/bindPhone/BindPhone'
import BindResult from '../pages/bindPhone/BindResult'
import RedirectPage from '../pages/RedirectPage'
// import UseStatus from '../pages/useStatus/UseStatus'
// import WorkSummary from '../pages/workSummary/WorkSummary'
import DemoTrigger from '../pages/demoTrigger/DemoTrigger'
import PageLoadable from '../utils/PageLoadable'
import PageLoading from '../components/PageLoading'
import PageNotFound from '../pages/PageNotFound'

const UasApprovalPage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/approval/UasApproval'),
  PageLoading)
const ApprovalHomePage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/approval/ApprovalHome'))
const ApprovalAddPage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/approval/ApprovalAdd'))
const ApprovalPage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/approval/Approval'))
const BillDetailsPage = PageLoadable(
  import(/* webpackChunkName:'approval' */'@/pages/approval/BillDetails'))
const UseStatus = PageLoadable(
  import(/* webpackChunkName:'chart' */'@/pages/useStatus/UseStatus'))
const WorkSummary = PageLoadable(
  import(/* webpackChunkName:'chart' */'@/pages/workSummary/WorkSummary'))

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

export class Routes extends React.Component {
  componentWillUnmount () {
    let storage = window.localStorage
    storage.removeItem('paramJson')
  }

  render () {
    return <Router
      basename={(process.env.REACT_APP_ROUTER_BASE_NAME || '') + '/uas'}
      getUserConfirmation={getConfirmation}>
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          <Route exact path='/' component={PageNotFound}/>
          {/*U审批过渡页面（入口页面）*/}
          <Route path='/uasApproval/:master/:type?'
                 component={UasApprovalPage}/>
          {/*U审批首页*/}
          <Route path='/approvalHome/:master/:type?'
                 component={ApprovalHomePage}/>
          {/*U审批详情页*/}
          <Route path='/approval/:paramsStr?' component={ApprovalPage}/>
          {/*无审批流单据详情页*/}
          <Route path='/billDetails/:caller/:master/:id'
                 component={BillDetailsPage}/>
          {/*U审批新增页面*/}
          <Route path='/approvalAdd/:caller/:master/:id?'
                 component={ApprovalAddPage}/>
          <Route path='/redirect/:paramsStr?' component={RedirectPage}/>

          {/*<Route exact path='/bindPhone' component={BindPhone}/>*/}
          <Route path='/bindPhone/:openId?' component={BindPhone}/>
          <Route path='/bindResult/:result' component={BindResult}/>

          <Route path='/usestatus/:instanceId' component={UseStatus}/>
          <Route path='/worksummary' component={WorkSummary}/>
          <Route path='/demotrigger' component={DemoTrigger}/>

          {/*404页面*/}
          <Route render={() => (
            // <Redirect to={'/redirect'}/>
            <Redirect to={'/'}/>
          )}/>
        </Switch>
      </div>
    </Router>
  }

}



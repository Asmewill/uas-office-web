/**
 * Created by RaoMeng on 2020/10/21
 * Desc: 项目接口
 */

export const _host = window.location.origin
  // && 'http://10.1.7.44:8081/erp'//吴雨骁
  // && 'http://10.1.7.137:8090/ERP'//吴炳
  // && 'http://usoft.f3322.net:10007/uas'
  // && 'http://erp.yitoa.com:8888/ERP'
  // && 'http://sisemi03.zicp.io/ERP/'

export const _baseURL = _host + (process.env.REACT_APP_ROUTER_BASE_NAME || '')

export const API = {
  /*******************************通用*************************************/
  //登录ERP
  COMMON_LOGIN: _baseURL + '/common/login.action',
  //应用红点数
  APPCOMMON_COUNT: _baseURL + '/mobile/appcommon/count/',
  //获取个人信息
  COMMON_GETUSERINFO: _baseURL + '/mobile/appcommon/getEmployee.action',
  //获取个人账套
  COMMON_GETACCOUNTLIST: _baseURL + '/common/getAbleMasters.action',
  //切换账套
  COMMON_CHANGEACCOUNT: _baseURL + '/common/changeMaster.action',
  //获取图表TYPE
  COMMON_GETSUBSTYPE: _baseURL + '/mobile/appcommon/getToDayAllType.action',
  //获取图表Data
  COMMON_GETSUBSDATA: _baseURL + '/mobile/appcommon/getToDayAllChart.action',
  //提交反馈
  COMMON_POSTFEEDBACK: _baseURL +
    '/mobile/appcommon/saveCustomerFeedback.action',

  //放大镜数据
  APPCOMMON_DBFIND: _baseURL + '/mobile/appcommon/dbfind.action',

  /*******************************应用*************************************/
  //应用菜单列表
  APPCOMMON_GETSERVICE: _baseURL + '/mobile/appweb/services/getServices.action',
  //保存常用应用
  APPCOMMON_SAVESERVICES: _baseURL +
    '/mobile/appweb/services/saveServices.action',
  //获取应用状态列表
  SERVICES_GETORDERTAB: _baseURL + '/mobile/appweb/services/getOrderTab.action',
  //获取应用列表
  SETVICES_GETORDERLIST: _baseURL +
    '/mobile/appweb/services/getOrderList.action',
  //获取应用详情
  SETVICES_GETORDER: _baseURL +
    '/mobile/appweb/services/getOrder.action',
  //单据提交
  SERVICES_COMMONSAVEANDSUBMITORDER: _baseURL +
    '/mobile/appweb/services/commonSaveAndSubmitOrder.action',

  //考核评估单据提交
  KPI_UPDATEANDSUBMITKPIBILL: _baseURL +
    '/mobile/appweb/services/hr/kpi/updateAndSubmitKpibill.action',

  //外勤计划获取拜访目的
  CRM_GETBUSINESSCHANCESTAGE: _baseURL +
    '/mobile/crm/getBusinessChanceStage.action',

  /*******************************报表*************************************/
  //获取报表菜单
  REPORT_QUERYREPORTLIST: _baseURL +
    '/mobile/appweb/report/queryReportList.action',
  //获取报表列表
  REPORT_GETREPORTLIST: _baseURL + '/mobile/appweb/report/getOrderList.action',
  //获取报表高级配置
  REPORT_GETORDERSEARCHFORM: _baseURL +
    '/mobile/appweb/report/getOrderSearchForm.action',

  /*******************************待办*************************************/
  //待办事项目列表
  APPCOMMON_TASKTODO: _baseURL + '/mobile/appcommon/list/taskToDo.action',
  //待办详情任务
  APPCOMMON_TASKDETAIL: _baseURL + '/mobile/appcommon/detail/taskToDo.action',
  //日常任务-确认
  APPCOMMON_DAILYTASKCOMFIRM: _baseURL + '/plm/record/confirmBillTask.action',
  //日常任务-驳回
  APPCOMMON_DAILYTASKNOCOMFIRM: _baseURL +
    '/plm/record/noConfirmBillTask.action',
  //日常任务-回复
  APPCOMMON_DAILYTASKREPLY: _baseURL + '/plm/record/endBillTask.action',
  //项目任务-提交
  APPCOMMON_PROJECTCOMMIT: _baseURL +
    '/mobile/appcommon/submitWorkRecord.action',

  /*******************************日程*************************************/
  //日程主界面
  APPCOMMON_DAILYTASKTOTAL: _baseURL +
    '/mobile/appweb/schedule/getCurrentScheduleList.action',
  //日程具体日期
  APPCOMMON_DAILYTASK: _baseURL + '/mobile/appweb/schedule/getSchedule.action',
  //日程月份状态
  APPCOMMON_MONTHLYTASKSTATUS: _baseURL +
    '/mobile/appweb/schedule/getScheduleList.action',
  //会议确认明细
  APPCOMMON_CONFERENCEDETAIL: _baseURL +
    '/mobile/appweb/order/metting/getMeetingDetail.action',
  //会议确认
  APPCOMMON_CONFERENCECONFIRM: _baseURL +
    '/mobile/appweb/order/metting/checkMeeting.action',

  /*******************************订阅*************************************/
  //获取可订阅列表
  SUBSCRIBE_GETSUBSCRIBELIST: _baseURL +
    '/mobile/appweb/subscribe/getSubscribeList.action',
  //获取已订阅类别
  SUBSCRIBE_GETMYSUBSCRIBEDLIST: _baseURL +
    '/mobile/appweb/subscribe/getMySubscribedList.action',
  //获取订阅推送列表
  SUBSCRIBE_SUBSCRIBETOPUSH: _baseURL +
    '/mobile/appweb/subscribe/subscribeToPush.action',
  //申请订阅
  SUBSCRIBE_APPLYSUBSCRIBE: _baseURL +
    '/mobile/appweb/subscribe/applySubscribe.action',
  //退订
  SUBSCRIBE_CANCELSUBSCRIBE: _baseURL +
    '/mobile/appweb/subscribe/cancelSubscribe.action',
  //加到首页
  SUBSCRIBE_ADDSUBSCRIBETOMAIN: _baseURL +
    '/mobile/appweb/subscribe/addSubscribeToMain.action',
  //订阅图表
  SUBSCRIBE_GETCHARTTYPE: _baseURL +
    '/mobile/appcommon/getSingleAllType.action',
}

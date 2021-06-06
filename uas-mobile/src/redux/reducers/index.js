import { combineReducers } from 'redux'
import redHomeState from './redHomeState'
import redMainState from './redMainState'
import redReportState from './redReportState'
import redDocState from './redDocState'
import redMineState from './redMineState'
import redListState from './redListState'
import redUserState from './redUserState'
import redFormState from './redFormState'
import redChartState from './redChartState'
import redScheduleState from './redScheduleState'
import redApprovalState from './redApprovalState'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 合并reducer，数据中心
 */
export const appReducer = combineReducers({
  homeState: redHomeState,
  mainState: redMainState,
  reportState: redReportState,
  docState: redDocState,
  mineState: redMineState,
  listState: redListState,
  userState: redUserState,
  formState: redFormState,
  chartState: redChartState,
  scheduleState: redScheduleState,
  approvalState: redApprovalState,
})

import { clearHomeState } from '../actions/homeState'
import { clearMainState } from '../actions/mainState'
import { clearReportState } from '../actions/reportState'
import { clearDocState } from '../actions/docState'
import { clearListState } from '../actions/listState'
import { clearUserInfo } from '../actions/userState'
import { clearChartState } from '../actions/chartState'
import { clearScheduleState } from '../actions/scheduleState'
import { clearApprovalHomeState } from '../actions/approvalState'

/**
 * Created by RaoMeng on 2020/12/14
 * Desc: redux全局方法
 */

/**
 * 清除所有redux缓存数据
 */
export function clearAllRedux () {
  clearHomeState()
  clearMainState()
  clearReportState()
  clearDocState()
  clearListState()
  clearUserInfo()
  clearChartState()
  clearScheduleState()
  clearApprovalHomeState()
}

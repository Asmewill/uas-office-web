/**
 * Created by RaoMeng on 2020/12/3
 * Desc: 操作报表缓存数据
 */
import store from '../store/store'
import {
  REFRESH_REPORT_LIST,
  CLEAR_REPORT_STATE,
} from '../constants/actionTypes'

/**
 * 保存报表数据
 * @param data
 * @returns {Function}
 */
export const refreshReportList = (data) => {
  return store.dispatch({
    type: REFRESH_REPORT_LIST,
    ...data,
  })
}

/**
 * 清除报表数据
 * @returns {Function}
 */
export const clearReportState = () => {
  return store.dispatch({
    type: CLEAR_REPORT_STATE,
  })
}

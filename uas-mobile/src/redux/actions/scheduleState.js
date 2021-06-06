/**
 * Created by Hujs on 2020/12/22
 * Desc: 日程数据缓存
 */

import { CLEAR_SCHEDULE_STATE, SAVE_SCHEDULE_STATE } from '../constants/actionTypes'
import store from '../store/store'

/**
 * 保存日程状态
 * @param data
 * @returns {Function}
 */
export const saveScheduleState = (data) => {
  return store.dispatch({
    type: SAVE_SCHEDULE_STATE,
    ...data,
  })
}

/**
 * 清除日程状态
 * @returns {Function}
 */
export const clearScheduleState = () => {
  return store.dispatch({
    type: CLEAR_SCHEDULE_STATE,
  })
}

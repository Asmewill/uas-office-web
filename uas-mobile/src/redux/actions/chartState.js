/**
 * Created by Hujs on 2020/12/16
 * Desc: 图表数据缓存
 */

import { CLEAR_CHART_STATE, SAVE_CHART_STATE } from '../constants/actionTypes'
import store from '../store/store'

/**
 * 保存图表状态
 * @param data
 * @returns {Function}
 */
export const saveChartState = (data) => {
  return store.dispatch({
    type: SAVE_CHART_STATE,
    ...data,
  })
}

/**
 * 清除图表状态
 * @returns {Function}
 */
export const clearChartState = () => {
  return store.dispatch({
    type: CLEAR_CHART_STATE,
  })
}

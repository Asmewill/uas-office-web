/**
 * Created by RaoMeng on 2020/12/2
 * Desc: 单据详情数据处理
 */
import store from '../store/store'
import {
  REFRESH_FORM_STATE,
  CLEAR_FORM_STATE, CLEAR_FILTER_STATE, CLEAR_BILL_STATE,
} from '../constants/actionTypes'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 刷新单据详情
 */
export const refreshFormState = (data) => {
  return store.dispatch({
    type: REFRESH_FORM_STATE,
    ...data,
  })
}

/**
 * 清除单据详情
 * @returns {Function}
 */
export const clearFilterState = () => {
  return store.dispatch({
    type: CLEAR_FILTER_STATE,
  })
}

/**
 * 清除单据详情
 * @returns {Function}
 */
export const clearBillState = () => {
  return store.dispatch({
    type: CLEAR_BILL_STATE,
  })
}

/**
 * 清除单据详情
 * @returns {Function}
 */
export const clearFormState = () => {
  return store.dispatch({
    type: CLEAR_FORM_STATE,
  })
}

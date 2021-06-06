/**
 * Created by RaoMeng on 2020/2/26
 * Desc: 操作搜索数据
 */

import store from '../store/store'
import {
  SEARCH_RECEIVE_STATE,
  SEARCH_SEND_STATE,
} from '../constants/actionTypes'

/**
 * 保存我审批的搜索数据
 * @param data
 * @returns {Function}
 */
export const saveSearchReceiveState = (data) => {
  return () => {
    store.dispatch({
      type: SEARCH_RECEIVE_STATE,
      ...data,
    })
  }
}
/**
 * 保存我发起的搜索数据
 * @param data
 * @returns {Function}
 */
export const saveSearchSendState = (data) => {
  return () => {
    store.dispatch({
      type: SEARCH_SEND_STATE,
      ...data,
    })
  }
}
/**
 * 删除搜索数据
 * @param data
 * @returns {Function}
 */
export const clearSearchState = (data) => {
  return () => {
    store.dispatch({
      type: SEARCH_RECEIVE_STATE,
      ...data,
    })
  }
}

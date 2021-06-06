/**
 * Created by RaoMeng on 2018/12/10
 * Desc: 列表数据缓存
 */

import { CLEAR_LIST_STATE, SAVE_LIST_STATE } from '../constants/actionTypes'
import store from '../store/store'

/**
 * 保存列表状态
 * @param data
 * @returns {Function}
 */
export const saveListState = (data) => {
  return store.dispatch({
    type: SAVE_LIST_STATE,
    ...data,
  })
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export const clearListState = () => {
  return store.dispatch({
    type: CLEAR_LIST_STATE,
  })
}

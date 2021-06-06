/**
 * Created by RaoMeng on 2020/11/19
 * Desc:操作应用数据缓存
 */

import store from '../store/store'
import { CLEAR_DOC_STATE, REFRESH_DOC_LIST } from '../constants/actionTypes'

/**
 * 保存列表状态
 * @param data
 * @returns {Function}
 */
export const refreshDocList = (data) => {
  return store.dispatch({
    type: REFRESH_DOC_LIST,
    ...data,
  })
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export const clearDocState = () => {
  return store.dispatch({
    type: CLEAR_DOC_STATE,
  })
}

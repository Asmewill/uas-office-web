/**
 * Created by RaoMeng on 2018/12/10
 * Desc: 列表数据缓存
 */

import {
  CLEAR_APPROVAL_HOME_STATE,
  CLEAR_RECEIVE_STATE,
  CLEAR_SEND_STATE,
  FRESH_APPROVAL_HOME_STATE,
  RECEIVE_TAB_STATE,
  SEND_TAB_STATE,
} from '../constants/actionTypes'
import store from '../store/store'

/**
 * 更新【我的审批】页面菜单数据
 * @param data
 * @returns {Function}
 */
export const saveReceiveState = (data) => {
  return () => {
    store.dispatch({
      type: RECEIVE_TAB_STATE,
      ...data,
    })
  }
}

/**
 * 更新【我发起的】页面菜单数据
 * @param data
 * @returns {Function}
 */
export const saveSendState = (data) => {
  return () => {
    store.dispatch({
      type: SEND_TAB_STATE,
      ...data,
    })
  }
}

export const clearReceiveState = (data) => {
  return () => {
    store.dispatch({
      type: CLEAR_RECEIVE_STATE,
      ...data,
    })
  }
}

export const clearSendState = (data) => {
  return () => {
    store.dispatch({
      type: CLEAR_SEND_STATE,
      ...data,
    })
  }
}

export const freshApprovalHomeState = (data) => {
  return () => {
    store.dispatch({
      type: FRESH_APPROVAL_HOME_STATE,
      ...data,
    })
  }
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export const clearApprovalHomeState = () => {
  return store.dispatch({
    type: CLEAR_APPROVAL_HOME_STATE,
  })
}

/**
 * Created by RaoMeng on 2018/12/10
 * Desc: 列表数据缓存
 */

import {
  CLEAR_HOME_STATE,
  CLEAR_NEW_STATE,
  CLEAR_RECEIVE_STATE,
  CLEAR_SEND_STATE,
  FRESH_HOME_STATE,
  NEW_TAB_STATE,
  RECEIVE_TAB_STATE,
  SEND_TAB_STATE,
} from '../constants/actionTypes'
import store from '../store/store'

/**
 * 更新【新建】页面菜单数据
 * @param data
 * @returns {Function}
 */
export const saveNewState = (data) => {
  return () => {
    store.dispatch({
      type: NEW_TAB_STATE,
      ...data,
    })
  }
}

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

export const clearNewState = (data) => {
  return () => {
    store.dispatch({
      type: CLEAR_NEW_STATE,
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

export const freshHomeState = (data) => {
  return () => {
    store.dispatch({
      type: FRESH_HOME_STATE,
      ...data,
    })
  }
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export const clearHomeState = () => {
  return () => {
    store.dispatch({
      type: CLEAR_HOME_STATE,
    })
  }
}

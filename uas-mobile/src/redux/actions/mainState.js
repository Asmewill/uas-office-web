/**
 * Created by RaoMeng on 2020/12/2
 * Desc: 首页数据处理
 */
import store from '../store/store'
import {
  CLEAR_MAIN_STATE,
  FRESH_MAIN_STATE,
} from '../constants/actionTypes'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 刷新首页状态
 */
export const refreshMainState = (data) => {
  return store.dispatch({
    type: FRESH_MAIN_STATE,
    ...data,
  })
}

/**
 * 清除首页状态
 * @returns {Function}
 */
export const clearMainState = () => {
  return store.dispatch({
    type: CLEAR_MAIN_STATE,
  })
}

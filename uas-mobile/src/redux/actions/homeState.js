/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 主页数据处理
 */
import store from '../store/store'
import {
  CLEAR_HOME_STATE,
  FRESH_HOME_STATE,
} from '../constants/actionTypes'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 刷新主页状态
 */
export const freshHomeState = (data) => {
  return store.dispatch({
    type: FRESH_HOME_STATE,
    ...data,
  })
}

/**
 * 清除主页状态
 * @returns {Function}
 */
export const clearHomeState = () => {
  return store.dispatch({
    type: CLEAR_HOME_STATE,
  })
}

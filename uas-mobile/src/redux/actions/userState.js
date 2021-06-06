/**
 * Created by Hujs on 2020/12/11
 * Desc: 个人信息
 */
import store from '../store/store'
import {
  SAVE_USER_STATE,
  CLEAR_USER_STATE,
} from '../constants/actionTypes'

/**
 * Created by Hujs on 2020/12/11
 * Desc: 储存个人信息
 */
export const saveUserInfo = (data) => {
  return store.dispatch({
    type: SAVE_USER_STATE,
    ...data,
  })
}

/**
 * 清除个人信息数据
 * @returns {Function}
 */
export const clearUserInfo = () => {
  return store.dispatch({
    type: CLEAR_USER_STATE,
  })
}


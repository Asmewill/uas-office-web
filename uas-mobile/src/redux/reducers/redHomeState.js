/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 首页数据缓存
 */
import {
  CLEAR_HOME_STATE,
  FRESH_HOME_STATE,
} from '../constants/actionTypes'

const initHomeState = {
  mainCount: 0,
  selectedTab: 0,
}

const redHomeState = (state = initHomeState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case FRESH_HOME_STATE:
      //更新首页数据
      return {
        ...state,
        ...action,
      }
    case CLEAR_HOME_STATE:
      //清空首页数据
      return initHomeState
    default:
      return state
  }
}

export default redHomeState

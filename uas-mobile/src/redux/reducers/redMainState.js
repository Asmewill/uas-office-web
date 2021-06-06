import { FRESH_MAIN_STATE, CLEAR_MAIN_STATE } from '../constants/actionTypes'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 主页数据缓存
 */

const initMainState = {
  dailyCount: 0,
  processCount: 0,
  taskCount: 0,
  subscribeCount:0
}

const redMainState = (state = initMainState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case FRESH_MAIN_STATE:
      //更新首页数据
      return {
        ...state,
        ...action,
      }
    case CLEAR_MAIN_STATE:
      //清空首页数据
      return initMainState
    default:
      return state
  }
}

export default redMainState

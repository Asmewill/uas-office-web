import redHomeState from './redHomeState'
import {
  CLEAR_HOME_STATE,
  CLEAR_SEARCH_RECEIVE_STATE,
  CLEAR_SEARCH_STATE,
  RECEIVE_TAB_STATE,
  SEND_TAB_STATE,
} from '../constants/actionTypes'

const initReceiveState = {
  tabIndex: 0,
  itemIndex: -1,
  keyword: '',

  scrollTop: 0,
  listData: [],
  hasMore1: true,
  pageIndex: 1,

  scrollTop2: 0,
  listData2: [],
  hasMore2: true,
  pageIndex2: 1,
}

const initSendState = {
  keyword: '',
  sendList: [],
  sendHasMore: true,
  scrollTop: 0,
}
const initSearchState = {
  receiveState: initReceiveState,
  sendState: initSendState,
}

const redSearchState = (state = initSearchState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case RECEIVE_TAB_STATE:
      //更新【我的审批】搜索数据
      return {
        ...state,
        receiveState: {
          ...state.receiveState,
          ...action,
        },
      }
    case SEND_TAB_STATE:
      //更新【我发起的】搜索数据
      return {
        ...state,
        sendState: {
          ...state.sendState,
          ...action,
        },
      }
    case CLEAR_SEARCH_STATE:
      //清空搜索数据
      return initSearchState
    default:
      return state
  }
}

export default redSearchState

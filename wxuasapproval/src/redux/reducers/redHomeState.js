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

const initNewState = {
  newMenuList: [],
  scrollTop: 0,
}
const initReceiveState = {
  tabIndex: 0,
  itemIndex: -1,
  searchKey: '',
  todoCount: 0,

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
  searchKey: '',
  sendList: [],
  sendHasMore: true,
  scrollTop: 0,
}

const initListState = {
  selectedTab: 0,
  newState: initNewState,
  receiveState: initReceiveState,
  sendState: initSendState,
}

const redHomeState = (state = initListState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case NEW_TAB_STATE:
      //更新新建菜单数据
      return {
        ...state,
        newState: {
          ...state.newState,
          ...action,
        },
      }
    case RECEIVE_TAB_STATE:
      //更新【我的审批】数据
      return {
        ...state,
        receiveState: {
          ...state.receiveState,
          ...action,
        },
      }
    case SEND_TAB_STATE:
      //更新【我发起的】数据
      return {
        ...state,
        sendState: {
          ...state.sendState,
          ...action,
        },
      }
    case CLEAR_NEW_STATE:
      //清除新建菜单数据
      return {
        ...state,
        newState: {
          ...initNewState,
          ...action,
        },
      }
    case CLEAR_RECEIVE_STATE:
      //清除[我的审批]数据
      return {
        ...state,
        receiveState: {
          ...initReceiveState,
          ...action,
        },
      }
    case CLEAR_SEND_STATE:
      //清除[我发起的]数据
      return {
        ...state,
        sendState: {
          ...initSendState,
          ...action,
        },
      }
    case FRESH_HOME_STATE:
      //更新首页数据
      return {
        ...state,
        ...action,
      }
    case CLEAR_HOME_STATE:
      //清空首页数据
      return initListState
    default:
      return state
  }

}

export default redHomeState

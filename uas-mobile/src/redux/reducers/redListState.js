import { CLEAR_LIST_STATE, SAVE_LIST_STATE } from '../constants/actionTypes'

const initListState = {
  scrollTop: 0,
  listData: [],
  pageIndex: 0,
  itemIndex: -1,

  tabIndex: 0,
  scrollTop2: 0,
  listData2: [],
  pageIndex2: 0,
  itemIndex2: -1,

  leftSelect: 0,
}

const redListState = (state = initListState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case SAVE_LIST_STATE:
      //更新列表状态
      return {
        ...state,
        ...action,
      }
    case CLEAR_LIST_STATE:
      //清空列表状态
      return initListState
    default:
      return state
  }

}

export default redListState

/**
 * Created by RaoMeng on 2020/12/9
 * Desc: 单据详情数据缓存
 */
import {
  REFRESH_FORM_STATE,
  CLEAR_FORM_STATE,
  CLEAR_FILTER_STATE,
  CLEAR_BILL_STATE,
} from '../constants/actionTypes'

const initFormState = {
  billGroupList: [],
  filterGroupList: [],
  stateType: '',
}

const redFormState = (state = initFormState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case REFRESH_FORM_STATE:
      //更新单据数据
      return {
        ...state,
        ...action,
      }
    case CLEAR_FILTER_STATE:
      //清空高级筛选配置
      return {
        ...state,
        filterGroupList: [],
      }
    case CLEAR_BILL_STATE:
      //清空单据详情数据
      return {
        ...state,
        billGroupList: [],
      }
    case CLEAR_FORM_STATE:
      //清空单据数据
      return initFormState
    default:
      return state
  }
}

export default redFormState

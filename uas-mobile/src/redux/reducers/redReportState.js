import {
  CLEAR_REPORT_STATE,
  REFRESH_REPORT_LIST,
} from '../constants/actionTypes'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 报表数据缓存
 */

const initReportState = {
  reportFuncGroupList: [],//报表菜单
  recentUse: [],//最近使用
  reportEmpty: false,
}

const redReportState = (state = initReportState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case REFRESH_REPORT_LIST:
      //更新报表列表
      return {
        ...state,
        ...action,
      }
    case CLEAR_REPORT_STATE:
      //清空报表列表数据
      return initReportState
    default:
      return state
  }
}

export default redReportState

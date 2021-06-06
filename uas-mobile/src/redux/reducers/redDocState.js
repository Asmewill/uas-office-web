import {
  CLEAR_DOC_STATE, REFRESH_DOC_COUNT,
  REFRESH_DOC_LIST,
} from '../constants/actionTypes'
import { isObjEmpty } from '../../utils/common/common.util'

/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 应用数据缓存
 */

const initDocState = {
  docFuncGroupList: [],
  docEmpty: false,
}

const redDocState = (state = initDocState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case REFRESH_DOC_LIST:
      //更新应用列表
      return {
        ...state,
        ...action,
      }
    case REFRESH_DOC_COUNT:
      const funcObj = action.funcObj
      if (!isObjEmpty(funcObj)) {
        let docFuncGroupList = state.docFuncGroupList
        if (!isObjEmpty(docFuncGroupList) &&
          !isObjEmpty(docFuncGroupList[funcObj.groupIndex])) {
          docFuncGroupList[funcObj.groupIndex].funcList[funcObj.childIndex].sup = funcObj.sup
        }
        return {
          ...state,
          docFuncGroupList,
        }
      }
      break
    case CLEAR_DOC_STATE:
      //清空应用列表数据
      return initDocState
    default:
      return state
  }
}

export default redDocState

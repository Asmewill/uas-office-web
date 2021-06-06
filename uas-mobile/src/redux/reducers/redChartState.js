import { CLEAR_CHART_STATE, SAVE_CHART_STATE } from '../constants/actionTypes'

const initChartState = {
  subsData: [],
}

const redChartState = (state = initChartState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case SAVE_CHART_STATE:
      //更新列表状态
      return {
        ...state,
        ...action,
      }
    case CLEAR_CHART_STATE:
      //清空列表状态
      return initChartState
    default:
      return state
  }

}

export default redChartState

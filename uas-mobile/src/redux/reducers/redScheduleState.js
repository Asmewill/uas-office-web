import { CLEAR_SCHEDULE_STATE, SAVE_SCHEDULE_STATE } from '../constants/actionTypes'

const initScheduleState = {
  punchClockData: {},
  noticeMatterData: [],
  calendarData: [],
  currentDate: new Date().format('yyyy-MM-dd'),
}

const redScheduleState = (state = initScheduleState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case SAVE_SCHEDULE_STATE:
      //更新列表状态
      return {
        ...state,
        ...action,
      }
    case CLEAR_SCHEDULE_STATE:
      //清空列表状态
      return initScheduleState
    default:
      return state
  }

}

export default redScheduleState

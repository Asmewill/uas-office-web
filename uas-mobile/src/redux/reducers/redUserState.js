import { SAVE_USER_STATE, CLEAR_USER_STATE } from '../constants/actionTypes'

const initUserState = {
  accountCode: '',
  accountId: '',
  accountName: '',
  companyName: '',
  departName: '',
  imgUrl: '',
  jobName: '',
  type: '',
  userName: '',
  userPost: '',
}

const redUserState = (state = initUserState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case SAVE_USER_STATE:
      //获取个人信息
      return {
        ...state,
        ...action,
      }
    case CLEAR_USER_STATE:
      //清空个人信息
      return initUserState
    default:
      return state
  }

}

export default redUserState

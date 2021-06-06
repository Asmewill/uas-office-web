import { Toast } from 'antd-mobile'
import { fetchPostObj, fetchGet } from '../common/fetchRequest'
import { API } from '../../configs/api.config'
import { message } from 'antd'
import { saveUserInfo, clearUserInfo } from '../../redux/actions/userState'

/**
 * 获取个人信息
 */
export function requestUserInfo () {
  return fetchGet(API.COMMON_GETUSERINFO).then(response => {
    saveUserInfo(response.data)
  }).catch(error => {
    clearUserInfo()
    if (typeof error === 'string') {
      message.error(error)
    } else {
      message.error('获取个人信息失败')
    }
  })
}
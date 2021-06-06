/**
 * Created by RaoMeng on 2020/12/4
 * Desc: 订阅模块通用方法
 */
import { Toast } from 'antd-mobile'
import { fetchPostObj } from '../common/fetchRequest'
import { API } from '../../configs/api.config'
import { message } from 'antd'
import { saveListState } from '../../redux/actions/listState'
import { isObjEmpty } from '../common/common.util'
import {
  SUBSCRIBE_ITEM_ALREADY,
  SUBSCRIBE_ITEM_NOT,
} from '../../configs/constans.config'

/**
 * 获取可订阅列表
 */
export function requestSubscribeConfig () {
  Toast.loading('数据请求中', 0)
  return fetchPostObj(API.SUBSCRIBE_GETSUBSCRIBELIST).then(response => {
    Toast.hide()
    analysisSubscribeConfig(response)
  }).catch(error => {
    Toast.hide()
    saveListState({
      listData: [],
    })
    if (typeof error === 'string') {
      message.error(error)
    } else {
      message.error('可订阅列表获取失败')
    }
  })
}

/**
 * 获取已订阅列表
 */
export function requestMySubscribe () {
  Toast.loading('数据请求中', 0)
  return fetchPostObj(API.SUBSCRIBE_GETMYSUBSCRIBEDLIST).then(response => {
    Toast.hide()
    analysisMySubscribe(response)
  }).catch(error => {
    Toast.hide()
    saveListState({
      listData2: [],
    })
    if (typeof error === 'string') {
      message.error(error)
    } else {
      message.error('已订阅列表获取失败')
    }
  })
}

/**
 * 解析并缓存可订阅数据
 * @param response
 */
export const analysisSubscribeConfig = (response) => {
  let subscribeConfigList = []
  if (!isObjEmpty(response.data, response.data.list)) {
    const responseList = response.data.list
    responseList.forEach((groupItem, groupIndex) => {
      const subscribeConfig = {
        className: groupItem.groupName,
      }
      const subList = []
      if (!isObjEmpty(groupItem.list)) {
        groupItem.list.forEach((childItem, childIndex) => {
          subList.push({
            id: childItem.ID_,
            title: childItem.TITLE_,
            img: childItem.IMG_,
            kind: childItem.KIND_,
            type: childItem.TYPE_,
            status: childItem.STATUS_,
            itemType: SUBSCRIBE_ITEM_NOT,
            groupIndex: groupIndex,
            childIndex: childIndex,
          })
        })
      }
      subscribeConfig.subList = subList

      subscribeConfigList.push(subscribeConfig)
    })
  }
  saveListState({
    scrollTop: 0,
    listData: subscribeConfigList,
  })
}

/**
 * 解析并缓存已订阅数据
 * @param response
 */
export const analysisMySubscribe = (response) => {
  let mySubscribeList = []
  if (!isObjEmpty(response.data, response.data.list)) {
    const responseList = response.data.list
    responseList.forEach((item, index) => {
      mySubscribeList.push({
        id: item.NUM_ID,
        title: item.TITLE_,
        img: item.IMG_,
        kind: item.KIND_,
        type: item.TYPE_,
        isApplied: item.ISAPPLIED_,
        remark: item.REMARK_,
        toMain: item.TOMAIN,//0：否，-1是 是否主页订阅
        itemType: SUBSCRIBE_ITEM_ALREADY,
      })
    })
  }
  saveListState({
    scrollTop2: 0,
    listData2: mySubscribeList,
  })
}

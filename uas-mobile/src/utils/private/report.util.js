/**
 * Created by RaoMeng on 2020/12/3
 * Desc: 报表模块通用方法类
 */

import { Toast } from 'antd-mobile'
import { fetchGet } from '../common/fetchRequest'
import { API } from '../../configs/api.config'
import { message } from 'antd'
import {
  clearReportState,
  refreshReportList,
} from '../../redux/actions/reportState'
import { isObjEmpty } from '../common/common.util'
import { FUNC_TYPE_REPORT } from '../../configs/constans.config'

/**
 * 获取报表菜单
 */
export function requestReportFunc () {
  refreshReportList({
    reportEmpty: false,
  })
  return fetchGet(API.REPORT_QUERYREPORTLIST).then(response => {
    Toast.hide()
    analysisReportList(response)
  }).catch(error => {
    Toast.hide()
    clearReportState()
    if (typeof error === 'string') {
      message.error(error)
    } else {
      message.error('报表列表获取失败')
    }
  })
}

/**
 * 解析并缓存报表菜单数据
 * @param response
 */
export const analysisReportList = (response) => {
  const data = response.data
  const reportFuncGroupList = [], recentUse = []
  if (!isObjEmpty(data)) {
    const currentlist = data.currentlist
    if (!isObjEmpty(currentlist)) {
      currentlist.forEach((childItem, childIndex) => {
        recentUse.push({
          id: childItem.SCHEMEID,
          name: childItem.TITLE,
          caller: childItem.TITLE,
          img: childItem.img,
          url: childItem.url,
          funcType: FUNC_TYPE_REPORT,
          iconColor: iconColors[iconColors.length - 1],
        })
      })
    }
    const responseList = data.list
    if (!isObjEmpty(responseList)) {
      responseList.forEach((groupItem, groupIndex) => {
        let reportFuncGroup = {
          groupTitle: groupItem.groupTitle,
          groupIndex: reportFuncGroupList.length,
        }
        const funcList = groupItem.list
        if (!isObjEmpty(funcList)) {
          let reportFuncList = []
          funcList.forEach((childItem, childIndex) => {
            reportFuncList.push({
              id: childItem.schemeId,
              name: childItem.title,
              parentTitle: childItem.parentTitle,
              caller: childItem.caller,
              img: childItem.img,
              url: childItem.url,
              groupIndex: reportFuncGroupList.length,
              childIndex: childIndex,
              funcType: FUNC_TYPE_REPORT,
              iconColor: iconColors[groupIndex % iconColors.length],
            })
          })
          reportFuncGroup.funcList = reportFuncList
        }
        reportFuncGroupList.push(reportFuncGroup)
      })
    }
  }

  refreshReportList({
    reportFuncGroupList,
    recentUse,
    reportEmpty: isObjEmpty(reportFuncGroupList) && isObjEmpty(recentUse),
  })
}

const iconColors = [
  '#2f95dd', '#9b7dc9', '#de935b', '#f57474', '#8bd67f', '#68d2c9',
]

import { Toast } from 'antd-mobile'
import { fetchGet, fetchPostObj } from '../common/fetchRequest'
import { _baseURL, API } from '../../configs/api.config'
import { refreshDocList } from '../../redux/actions/docState'
import { message } from 'antd'
import { isObjEmpty } from '../common/common.util'
import { FUNC_TYPE_DOC } from '../../configs/constans.config'

/**
 * Created by RaoMeng on 2020/12/3
 * Desc: 应用模块通用方法类
 */

/**
 * 获取应用列表
 */
export function requestServices () {
  refreshDocList({
    docEmpty: false,
  })
  return fetchPostObj(API.APPCOMMON_GETSERVICE, {
    kind: 'uasapp',
  }).then(response => {
    Toast.hide()
    analysisDocList(response)
  }).catch(error => {
    Toast.hide()
    refreshDocList({
      docFuncGroupList: [],
    })
    if (typeof error === 'string') {
      message.error(error)
    } else {
      message.error('应用列表获取失败')
    }
  })
}

/**
 * 解析并缓存应用列表数据
 * @param response
 */
export const analysisDocList = (response) => {
  const data = response.data
  const docFuncGroupList = []
  if (!isObjEmpty(data)) {
    const responseList = data.list
    if (!isObjEmpty(responseList)) {
      responseList.forEach((groupItem, groupIndex) => {
        let docFuncGroup = {
          groupTitle: groupItem.groupTitle,
          groupIndex: docFuncGroupList.length,
        }
        const funcList = groupItem.funcList
        if (!isObjEmpty(funcList)) {
          let docFuncList = []
          funcList.forEach((childItem, childIndex) => {
            const funcObj = {
              id: childItem.fid,
              name: childItem.name,
              caller: childItem.caller,
              img: childItem.icon && childItem.icon.exticon,
              icon: childItem.icon && childItem.icon.deficon,
              often: childItem.often,
              readOnly: childItem.readOnly,
              url: childItem.url && childItem.url.skipurl,
              route: childItem.url && childItem.url.specialrout,
              countUrl: (childItem.url && childItem.url.counturl) ? (_baseURL +
                childItem.url.counturl) : '',
              groupIndex: docFuncGroupList.length,
              childIndex: childIndex,
              funcType: FUNC_TYPE_DOC,
            }
            docFuncList.push(funcObj)

            //获取红点
            if (!isObjEmpty(funcObj.countUrl)) {
              fetchGet(funcObj.countUrl).then(response => {
                funcObj.sup = response.data
                docFuncGroupList[funcObj.groupIndex].funcList[funcObj.childIndex].sup = funcObj.sup
                refreshDocList({ docFuncGroupList })
              }).catch(error => {
                funcObj.sup = 0
                docFuncGroupList[funcObj.groupIndex].funcList[funcObj.childIndex].sup = funcObj.sup
                refreshDocList({ docFuncGroupList })
              })
            }
          })
          docFuncGroup.funcList = docFuncList
        }
        docFuncGroupList.push(docFuncGroup)
      })
    }
  }

  refreshDocList({
    docFuncGroupList,
    docEmpty: isObjEmpty(docFuncGroupList),
  })
}

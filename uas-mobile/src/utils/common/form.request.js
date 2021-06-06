/**
 * Created by RaoMeng on 2020/12/11
 * Desc: 通用表单数据处理
 */
import { isObjEmpty, isObjNull } from './common.util'
import BillGroupModel from '../../model/common/BillGroupModel'
import BillModel, {
  billGetDisplay,
  billGetValue, billIsEnclosure,
} from '../../model/common/BillModel'
import { message } from 'antd'
import store from '../../redux/store/store'
import { _baseURL } from '../../configs/api.config'

export function analysisFormData (formData, isDetail) {
  let billGroupList = []
  if (!isObjEmpty(formData)) {
    const formList = formData.formList
    const gridList = formData.gridList

    /**
     * 主表数据
     */
    if (!isObjEmpty(formList)) {
      formList.forEach((formGroup, formIndex) => {
        const billGroup = getBillGroup(formGroup, billGroupList.length,
          isDetail)
        billGroup.isForm = true
        billGroupList.push(billGroup)
      })
    }

    /**
     * 从表数据
     */
    if (!isObjEmpty(gridList)) {
      gridList.forEach((gridGroup, gridIndex) => {
        //单个从表的明细列表
        const gridDetailList = gridGroup.fieldList
        if (!isObjEmpty(gridDetailList)) {
          gridDetailList.forEach((gridDetail, gridDetailIndex) => {
            const billGroup = getBillGroup({
              ...gridGroup,
              fieldList: gridDetail,
            }, billGroupList.length, isDetail)
            if (!isDetail && gridDetailIndex === (gridDetailList.length - 1)) {
              billGroup.lastInType = true
            } else {
              billGroup.lastInType = false
            }
            billGroup.isForm = false
            billGroupList.push(billGroup)
          })
        }
      })
    }
  }

  return billGroupList
}

export function getBillGroup (groupItem, groupIndex, isDetail) {
  let billGroup = new BillGroupModel()
  billGroup.group = groupItem.groupTitle
  billGroup.isForm = groupItem.isForm
  billGroup.keyField = groupItem.keyField
  billGroup.billCaller = groupItem.groupCaller
  billGroup.groupIndex = groupIndex

  let showBillFields = [], hideBillFields = []
  if (!isObjEmpty(groupItem.fieldList)) {
    groupItem.fieldList.forEach((fieldItem, filedIndex) => {
      let billModel = new BillModel()

      billModel.groupIndex = groupIndex
      // billModel.childIndex = filedIndex
      billModel.appwidth = fieldItem.appwidth
      billModel.length = fieldItem.length
      billModel.isdefault = fieldItem.isdefault
      billModel.readOnly = (fieldItem.readOnly || isDetail)
      billModel.field = fieldItem.field
      billModel.logicType = fieldItem.logicType
      billModel.findFunctionName = fieldItem.findfunctionname
      billModel.allowBlank = (fieldItem.allowBlank || isDetail)
      billModel.allowBlankReal = fieldItem.allowBlank
      billModel.caption = fieldItem.caption

      billModel.type = fieldItem.type//前端类型
      billModel.sourcetype = fieldItem.sourcetype//字段原类型
      if (billModel.type === 'MF' && !billGroup.isForm) {
        //移动端不支持从表的放大镜多选类型
        //将多选类型识别为放大镜单选类型
        billModel.type = 'DF'
      }

      billModel.value = fieldItem.value
      billModel.display = fieldItem.display
      billModel.defValue = fieldItem.defValue
      billModel.localDatas = fieldItem.localDatas
      if (isObjEmpty(billModel.value) &&
        !isObjEmpty(billModel.defValue, billModel.localDatas)) {
        billModel.localDatas.forEach(item => {
          if (item.display === billModel.defValue) {
            billModel.value = item.value
            billModel.display = item.display
          }
        })
      }

      //添加附件
      let filePaths = fieldItem.filePaths
      if (billIsEnclosure(billModel)) {
        let fileList = []
        if (!isObjEmpty(filePaths)) {
          filePaths.forEach((item, index) => {
            let fileObj = {}
            fileObj.uid = 'rc-upload-' + new Date().getTime() + '-' + index
            fileObj.enclosureId = item.fp_id
            fileObj.url = item.pathurl || (_baseURL +
              '/common/downloadbyId.action?id=' +
              fileObj.enclosureId
              + '&master=' + store.getState().userState.accountCode)
            fileObj.name = item.fp_name
            fileObj.size = item.fp_size
            fileObj.status = 'done'

            fileList.push(fileObj)
          })
        }
        billModel.fileList = fileList
      }

      //是否是显示字段，添加到show或hide列表
      if (billModel.isdefault) {
        showBillFields.push(billModel)
      } else {
        hideBillFields.push(billModel)
      }
    })
  }

  billGroup.showBillFields = showBillFields
  billGroup.hideBillFields = hideBillFields

  return billGroup
}

/**
 * 解析拼接单据数据
 * @param billGroupModelList
 * @returns {{form: *, grid: (null|[])}}
 */
export function getFormAndGrid (billGroupModelList) {
  if (!isObjEmpty(billGroupModelList)) {
    const fields = analysisFields(billGroupModelList)

    let formStore = analysisForm(fields.formFields)
    if (isObjNull(formStore)) {
      return
    }
    let gridStoreList = analysisGrid(fields.gridGroupFields)
    if (isObjNull(gridStoreList)) {
      return
    }

    return {
      form: formStore,
      grid: gridStoreList,
      formFields: fields.formFields,
      gridFields: fields.gridGroupFields,
    }
  }
}

/**
 * 返回主表与从表字段配置列表
 * @param billGroupModelList
 * @returns {{formFields: [], gridGroupFields: []}}
 */
function analysisFields (billGroupModelList) {
  let formFields = [], gridGroupFields = []
  for (let i = 0; i < billGroupModelList.length; i++) {
    let billGroup = billGroupModelList[i]
    if (isObjNull(billGroup)) {
      continue
    }
    if (billGroup.isForm) {
      if (!isObjEmpty(billGroup.showBillFields)) {
        formFields = formFields.concat(billGroup.showBillFields)
      }
      if (!isObjEmpty(billGroup.hideBillFields)) {
        formFields = formFields.concat(billGroup.hideBillFields)
      }
    } else {
      let gridFields = []
      if (!isObjEmpty(billGroup.showBillFields)) {
        gridFields = gridFields.concat(billGroup.showBillFields)
      }
      if (!isObjEmpty(billGroup.hideBillFields)) {
        gridFields = gridFields.concat(billGroup.hideBillFields)
      }
      gridGroupFields.push(gridFields)
    }
  }
  return {
    formFields,
    gridGroupFields,
  }
}

/**
 * 判断主表字段必填情况，拼接主表字段
 * @param formFields
 * @returns {null}
 */
function analysisForm (formFields) {
  if (!isObjNull(formFields)) {
    let formStore = {}
    for (let i = 0; i < formFields.length; i++) {
      let billModel = formFields[i]
      if (isObjNull(billModel)) {
        continue
      }
      if (isObjEmpty(billGetValue(billModel)) && !billModel.allowBlank) {
        message.error(`${billModel.caption}为必填项`)
        return null
      }
      //Todo 附件上传

      formStore[billModel.field] = billGetDisplay(billModel)
    }
    return formStore
  } else {
    return null
  }
}

function analysisGrid (gridBillMap) {
  let gridStoreList = []
  if (!isObjNull(gridBillMap)) {
    for (let i = 0; i < gridBillMap.length; i++) {
      let gridFields = gridBillMap[i]
      if (!isObjEmpty(gridFields)) {
        let gridStore = {}
        for (let j = 0; j < gridFields.length; j++) {
          let billModel = gridFields[j]
          if (isObjEmpty(billGetValue(billModel)) && !billModel.allowBlank) {
            message.error(`${billModel.caption}为必填项`)
            return null
          }
          //Todo 附件上传

          gridStore[billModel.field] = billGetDisplay(billModel)
        }
        gridStoreList.push(gridStore)
      }
    }
  }
  return gridStoreList
}



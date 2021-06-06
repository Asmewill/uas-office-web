import { isObjEmpty, isObjNull } from '../../utils/common/common.util'

export default function BillModel (billModel) {
  if (isObjNull(billModel)) {
    this.id = 0//id
    this.groupIndex = 0//所在组索引
    this.childIndex = 0//组内索引
    this.detno = 1000000//序号
    this.length = 0//字符长度
    this.appwidth = 0//宽度
    this.isdefault = false//是否显示
    this.dbfind = ''//是否是dbfind字段判定
    this.caption = ''//字段名称
    this.type = ''//类型(标题类型为Constants.TYPE_TITLE,不触发点击事件等 )
    this.sourcetype = ''//字段原类型
    this.logicType = ''//logic类型
    this.readOnly = true//字段是否只读
    this.field = ''//字段
    this.value = ''//上传值
    this.display = ''//显示值
    this.defValue = ''//默认值
    this.findFunctionName = ''//默认值
    this.allowBlank = true//是否允许为空(注:当作为标题的时候true表示可以删除 false表示不可删除)
    this.renderer = ''
    this.enclusureId = ''
    this.localDatas = []//获取到的本地选择数据
    this.mBillJump = ''//判断是否需要要跳转字段
    this.mTabList = []//是否
    this.updatable = ''//是否可更新
    this.editable = ''//是否可编辑（临时属性，对某些字段的特殊处理，和字段本身属性无关，在添加明细时，要重置这个值）
  } else {
    this.id = billModel.id
    this.groupIndex = billModel.groupIndex + 1
    this.childIndex = billModel.childIndex
    this.length = billModel.length
    this.detno = billModel.detno
    this.appwidth = billModel.appwidth
    this.isdefault = billModel.isdefault
    this.dbfind = billModel.dbfind
    this.caption = billModel.caption
    this.type = billModel.type
    this.sourcetype = billModel.sourcetype
    this.logicType = billModel.logicType
    this.readOnly = billModel.readOnly
    this.field = billModel.field
    this.defValue = billModel.defValue
    this.renderer = billModel.renderer
    this.enclusureId = billModel.enclusureId
    this.allowBlank = billModel.allowBlank
    this.findFunctionName = billModel.findFunctionName
    this.mBillJump = billModel.mBillJump
    this.localDatas = billModel.localDatas
    this.mTabList = billModel.mTabList
    this.updatable = billModel.updatable
    this.editable = ''//复制字段时要重置

    if (billIsShow(billModel) == false
      && !isObjEmpty(billModel.renderer)
      && billModel.renderer.indexOf('defaultValue') != -1) {
      //隐藏字段，renderer里包含defaultValue，则复制value
      this.value = billModel.value
      this.display = billModel.display
    } else {
      this.value = ''
      this.display = ''
    }
  }
}

/**
 * 返回字段显示值
 * @param billModel
 * @returns {string}
 */
export function billGetValue (billModel) {
  const value = billModel.value || billModel.defValue || ''
  return value.toString()
}

/**
 * 返回字段真实值
 * @param billModel
 * @returns {*|string}
 */
export function billGetDisplay (billModel) {
  return billModel.display || billGetValue(billModel)
}

/**
 * 返回日期区间值
 * @param billModel
 * @returns {*|string}
 */
export function billGetDateRange (billModel) {
  const value = billModel.value
  return value ? value.from + '~' + value.to : ''
}

export function billReadOnly (billModel) {
  return (billModel.readOnly || billModel.editable === 'F')
}

/**
 * 字段是否显示
 * @param billModel
 * @returns {boolean|*}
 */
export function billIsShow (billModel) {
  return billModel.isdefault && billModel.type !== 'H'
}

/**
 * 是否是选择类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsSelect (billModel) {
  if (!isObjEmpty(billModel.localDatas)) {
    return true
  }
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'C':
    case 'B':
    case 'D':
    case 'DT':
    case 'YM':
    case 'YMD':
    case 'MF':
    case 'SF':
    case 'DF':
      return true
  }
  return false
}

/**
 * 是否是单选本地数据选择
 * @param billModel
 * @returns {boolean}
 */
export function billIsCombo (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'C':
    case 'B':
      return true
  }
  return false
}

/**
 * 是否是单选放大镜
 * @param billModel
 * @returns {boolean}
 */
export function billIsSingleDbfind (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'SF':
    case 'DF':
      return true
  }
  return false
}

/**
 * 是否是多选放大镜
 * @param billModel
 * @returns {boolean}
 */
export function billIsMultiDbfind (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'MF':
      return true
  }
  return false
}

/**
 * 字段是否是日期类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsDateSingle (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'DT':
    case 'D':
    case 'T':
      return true
  }
  return false
}

/**
 * 字段是否是日期区间类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsDateRange (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'YM':
    case 'YMD':
      return true
  }
  return false
}

/**
 * 字段是否是数字类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsNum (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'N':
      return true
  }
  return false
}

/**
 * 字段是否是html类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsHtml (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'HTML':
    case 'HOS':
      return true
  }
  return false
}

/**
 * 字段是否是多行字符串类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsMultiLine (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'MS':
      return true
  }
  return false
}

/**
 * 字段是否是附件类型
 * @param billModel
 * @returns {boolean}
 */
export function billIsEnclosure (billModel) {
  let dfType = billModel.type
  if (isObjEmpty(dfType)) {
    return false
  }
  switch (dfType) {
    case 'FF':
    case 'PF':
      return true
  }
  return false
}

/**
 * 返回字段布局类型
 * @param dfType
 * @returns {number}
 */
export function getItemViewType (dfType) {
  if (isObjEmpty(dfType)) {
    return -1
  }
  switch (dfType.toUpperCase()) {
    case TYPE_TITLE:
      return 0
    case TYPE_ADD:
      return 110
    case TYPE_TAB:
      return 111
    case 'C':
    case 'B':
    case 'SF':
    case 'DF':
    case 'S':
    case 'SS':
      return 1
    case 'FF':
    case 'PF':
      return 2
    default:
      return 1
  }
}

export const TYPE_TITLE = 'LOCAL_TITLE'
export const TYPE_ADD = 'LOCAL_ADD'
export const TYPE_TAB = 'LOCAL_TAB'

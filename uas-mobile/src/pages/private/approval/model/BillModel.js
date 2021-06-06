import { isObjEmpty, isObjNull } from '../../../../utils/common/common.util'

export default function BillModel (billModel) {
  if (isObjNull(billModel)) {
    this.id = 0//id
    this.groupIndex = 0//所在组索引
    this.detno = 1000000//序号
    this.length = 0//字符长度
    this.appwidth = 0//宽度
    this.isdefault = 0//是否显示
    this.dbfind = ''//是否是dbfind字段判定
    this.caption = ''//字段名称
    this.type = ''//类型(标题类型为Constants.TYPE_TITLE,不触发点击事件等 )
    this.logicType = ''//logic类型
    this.readOnly = ''//字段是否只读  T/F
    this.field = ''//字段
    this.value = ''//值
    this.display = ''//上传值
    this.defValue = ''//默认值
    this.findFunctionName = ''//默认值
    this.allowBlank = ''//是否允许为空(注:当作为标题的时候T:表示可以删除 F:表示不可删除)
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
    this.length = billModel.length
    this.detno = billModel.detno
    this.appwidth = billModel.appwidth
    this.isdefault = billModel.isdefault
    this.dbfind = billModel.dbfind
    this.caption = billModel.caption
    this.type = billModel.type
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

    this.isShow = billModel => (
      billModel.isdefault === -1 && billModel.type === 'H'
    )
    if (this.isShow(billModel) == false
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

  this.getValue = () => (
    this.value || this.defValue || ''
  )

  this.getDisplay = () => (
    this.display || this.getValue()
  )
}

export const TYPE_TITLE = 'LOCAL_TITLE'
export const TYPE_ADD = 'LOCAL_ADD'
export const TYPE_TAB = 'LOCAL_TAB'

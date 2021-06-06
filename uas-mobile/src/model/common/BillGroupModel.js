/**
 * 单据分组Model
 * @constructor
 */
import { isObjEmpty, isObjNull } from '../../utils/common/common.util'

export default function BillGroupModel () {
  this.isDeleteAble = false//是否可以删除
  this.isForm = false//是否是主表
  this.lastInType = false//是否当前单据明细的最后一个
  this.groupIndex = 0//当前组所在的整个显示集合里面的索引
  this.gridIndex = 0//当前组在明细表内的索引
  this.minDetno = 10000000//最小的序号
  this.group = ''//组名
  this.keyField = ''//提交时候主表或明细表id字段名称
  this.mTagMap = {}//附带信息
  this.billCaller = ''//表caller

  this.hideBillFields = []//当前组隐藏的字段列表
  this.showBillFields = []//当前组显示的字段列表
  this.updateBillFields = []//当前组可更新的字段列表
  this.dex = 0//当前组所在的整个显示集合里面的索引

  this.updateTagMap = function (key, value) {
    if (isObjEmpty(key)) {
      return
    }
    if (isObjNull(this.mTagMap)) {
      this.mTagMap = {}
    }
    this.mTagMap.key = value
  }

  this.addHide = function (billModel) {
    if (isObjNull(billModel)) {
      return
    }
    if (isObjNull(this.hideBillFields)) {
      this.hideBillFields = []
    }
    this.hideBillFields.push(billModel)
  }

  this.addShow = function (billModel) {
    if (isObjNull(billModel)) {
      return
    }
    if (isObjNull(this.showBillFields)) {
      this.showBillFields = []
    }
    this.showBillFields.push(billModel)
  }

  this.addUpdate = function (billModel) {
    if (isObjNull(billModel)) {
      return
    }
    if (isObjNull(this.updateBillFields)) {
      this.updateBillFields = []
    }
    this.updateBillFields.push(billModel)
  }
}

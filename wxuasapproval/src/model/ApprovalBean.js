import { isObjEmpty, isObjNull, strContain } from '../utils/common'
import moment from 'moment'

export default function ApprovalBean (type) {
  this.neerInput = false//是否需要输入
  this.mustInput = false//是否是必填字段
  this.id = -1
  this.type = type
  this.idKey = ''
  this.caller = ''
  this.gCaller = ''
  this.coreKey = ''
  this.dfType = ''//返回的字段类型
  this.dbFind = ''//是否dbfind的判断
  this.caption = ''//字幕，表示备注
  this.values = ''//字幕对应的值显示
  this.oldValues = ''//变更前的值
  this.valuesKey = ''//字幕对应的值显示的key值
  this.datas = []

  this.data2Values = function () {
    switch (this.dfType) {
      case 'D':
        this.data2DType()
        break
      case 'B':
        if (this.values == 1) {
          this.values = ApprovalBean.VALUES_YES
        } else {
          this.values = ApprovalBean.VALUES_NO
        }
        this.setOldSelectValues()
        break
      //后台接口做了转换，前端无需转换
      /*case 'YN':
        if (this.values == '-1') {
          this.values = ApprovalBean.VALUES_YES
        } else if (this.values == 1 && this.type == ApprovalBean.DETAIL &&
          this.neerInput) {
          this.values = ApprovalBean.VALUES_UNKNOWN
        } else {
          this.values = ApprovalBean.VALUES_NO
        }
        this.setOldSelectValues()
        break
      case 'C':
        if (this.values == '-1') {
          this.values = ApprovalBean.VALUES_YES
        } else if (this.values == '1' && this.type == ApprovalBean.DETAIL &&
          this.neerInput) {
          this.values = ApprovalBean.VALUES_UNKNOWN
        } else if (this.values == '0') {
          this.values = ApprovalBean.VALUES_NO
        }
        this.setOldSelectValues()
        break*/
    }
  }

  this.isDBFind = function () {
    return (this.dbFind == 'T' || this.dbFind == 'AT' || this.dbFind == 'M' ||
      this.dbFind == 'DF')
  }

  this.setOldSelectValues = function () {
    if (!isObjNull(this.oldValues)) {
      if (this.oldValues == '0') {
        this.oldValues = ApprovalBean.VALUES_NO
      } else if (this.oldValues == '-1' || this.oldValues == '1') {
        this.oldValues = ApprovalBean.VALUES_YES
      }
    }
  }

  this.data2DType = function () {
    // let time = Date.parse(new Date(this.values.replace(/\-/g, '/')))
    // if (time > 0) {
    //   let newDate = new Date()
    //   newDate.setTime(time)
    //   this.values = moment(newDate).format('YYYY-MM-DD')
    // }
    if (!isObjEmpty(this.values)) {
      let newDate = new Date(this.values.replace(/\-/g, '/'))
      if (!isObjEmpty(newDate) && newDate !== 'Invalid date') {
        this.values = moment(newDate).format('YYYY-MM-DD')
      }
    }

    if (!isObjEmpty(this.oldValues)) {
      let oldDate = new Date(this.oldValues.replace(/\-/g, '/'))
      if (!isObjEmpty(oldDate) && oldDate !== 'Invalid date') {
        this.oldValues = moment(oldDate).format('YYYY-MM-DD')
      }
    }
  }

  this.isNumber = function () {
    return this.dfType == 'N'
      || this.dfType == 'floatcolumn8'
      || this.dfType == 'SN'
      || strContain(this.dfType, 'floatcolumn')
  }

  this.isSelect = function () {
    return this.dfType == 'C' || this.dfType == 'D' || this.dfType == 'DT'
      || this.dfType == 'C' || this.dfType == 'YN' || this.dfType == 'B'
  }

  /**
   * 输入类型：0字符输入  1.数字输入  2.日期输入选择  3.下拉选择  4.dbfind
   */
  this.inputType = function () {
    if (this.isNumber()) {
      return 1
    } else if (this.dfType == 'DT' || this.dfType == 'D') {
      return 2
    } else if (this.dfType == 'C') {
      return 3
    } else if (this.isDBFind()) {
      return 4
    } else if (this.dfType == 'B' || this.dfType == 'YN') {
      return 5
    }
    return 0
  }

}

ApprovalBean.Data = function (value, display) {
  this.value = value
  this.display = display
}

ApprovalBean.VALUES_YES = '是'
ApprovalBean.VALUES_NO = '否'
ApprovalBean.VALUES_UNKNOWN = '未选择'

ApprovalBean.TITLE = 11//标题
ApprovalBean.MAIN = 12  //主表
ApprovalBean.DETAIL = 13//从表
ApprovalBean.SETUPTASK = 14//历史审批要点
ApprovalBean.ENCLOSURE = 16//附件
ApprovalBean.POINTS = 17//要点
ApprovalBean.NODES_TAG = 18//审批节点标记
ApprovalBean.NODES = 19//审批节点
ApprovalBean.TAG = 20//标题

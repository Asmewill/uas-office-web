/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 通用表单输入框类型
 */

import React, { Component } from 'react'
import './formCommon.css'
import BillModel from '../../model/BillModel'
import {
  TextareaItem,
  InputItem,
  DatePicker,
  List,
  Modal,
} from 'antd-mobile'
import { isObjEmpty } from '../../../../../utils/common/common.util'
import moment from 'moment'

export default class FormInput extends Component {

  constructor () {
    super()

    this.state = {
      billModel: new BillModel(),
      modalOpen: false,
      modalList: [],
    }
  }

  componentDidMount () {
    let { billModel } = this.props

    this.setState({
      billModel: billModel,
    })
  }

  componentWillReceiveProps () {
    this.componentDidMount()
  }

  componentWillUnmount () {

  }

  render () {
    const { billModel, modalOpen, modalList } = this.state
    let valueItem

    let type = billModel.type
    switch (type) {
      case 'N':
        valueItem =
          this.getNumCom(billModel)
        break
      case 'DT':
      case 'D':
      case 'T':
        valueItem =
          this.getDateCom(type, billModel)
        break
      case 'HTML':
        valueItem =
          this.getHtmlcom(billModel)
        break
      default:
        valueItem =
          this.getTextCom(billModel)
        break
    }
    return (
      (type === 'DT' || type === 'D' || type === 'T') ? <div>
          {valueItem}
        </div> :
        (type === 'MS') ? (this.renderTwoLines(
          billModel,
          valueItem)) :
          (this.renderNormal(billModel, valueItem, modalOpen, modalList))
    )
  }

  /**
   * 加载普通类型
   * @param billModel
   * @param valueItem
   * @param modalOpen
   * @param modalList
   * @returns {*}
   */
  renderNormal (billModel, valueItem, modalOpen, modalList) {
    return <div className='form-common-layout'
                style={{ minHeight: '32px' }}>
      <div className='form-input-caption'>{billModel.caption}</div>
      <div className={billModel.allowBlank == 'F'
        ? 'form-input-fill'
        : 'visibleHidden'}>*
      </div>
      {valueItem}
      {this.isSelect(billModel) &&
      <Modal visible={modalOpen}
             animationType={'slide-up'}
             onClose={() => {
               this.setState({
                 modalOpen: false,
               })
             }}
             title={billModel.caption}
             popup
      >
        <List className='form-common-modal-root'>
          {modalList && (
            modalList.map((modalObj, index) => (
              <List.Item key={index}
                         onClick={this.onModalSelect.bind(this,
                           index)}>{modalObj.value + ''}</List.Item>
            ))
          )}
        </List>
      </Modal>}
    </div>
  }

  /**
   * 加载标题和内容单独分行
   * @param billModel
   * @param valueItem
   * @returns {*}
   */
  renderTwoLines (billModel, valueItem) {
    return <div className={'form-textarea-layout'}>
      <div className='form-common-layout'
           style={{ borderBottom: 'none' }}>
        <div style={{
          minWidth: '90px',
          fontSize: '14px',
          color: '#333333',
        }}>{billModel.caption}</div>
        <div className={billModel.allowBlank == 'F'
          ? 'form-input-fill'
          : 'visibleHidden'}>*
        </div>
      </div>
      {valueItem}
    </div>
  }

  /**
   * 文本输入类型
   * @param billModel
   * @returns {*}
   */
  getTextCom (billModel) {
    return <TextareaItem className='form-input-value' autoHeight
                         placeholder={this.isSelect(billModel)
                           ? '请选择'
                           : ((billModel.readOnly === 'T' ||
                             billModel.editable === 'F')
                             ? ''
                             : '请输入')}
                         clear={true}
                         editable={(billModel.readOnly === 'T' ||
                           billModel.editable === 'F')
                           ? false
                           : (this.isSelect(billModel)
                             ? false
                             : true)}
                         disabled={false}
      // extra={(billModel.readOnly === 'T' &&
      //   billModel.editable === 'F' && this.isSelect(billModel))
      //   ? '>'
      //   : ''}
                         onChange={this.onTextChange}
                         onClick={this.onInputClick}
                         value={billModel.getValue()}
    />
  }

  /**
   * html类型字符串
   * @param billModel
   * @returns {*}
   */
  getHtmlcom (billModel) {
    return <div className='form-input-value'
                style={{ minHeight: '32px' }}
                dangerouslySetInnerHTML={{ __html: billModel.getValue() }}></div>
  }

  /**
   * 日期类型
   * @param type
   * @param billModel
   * @returns {*}
   */
  getDateCom (type, billModel) {
    return <DatePicker
      style={{ width: '100%' }}
      locale={{
        okText: '确定',
        dismissText: '取消',
      }}
      mode={type === 'DT' ? 'datetime' : 'date'}
      extra={(billModel.readOnly === 'T' ||
        billModel.editable === 'F') ? '' : type === 'DT' ? '选择时间' : '选择日期'}
      disabled={(billModel.readOnly === 'T' ||
        billModel.editable === 'F') ? true : false}
      value={!isObjEmpty(billModel.getValue())
        ? new Date(billModel.getValue().replace(/\-/g, '/'))
        : ''}
      onChange={this.onDateChange}
    >
      <DatePickerCustom>
        <div className='form-input-caption'>{billModel.caption}</div>
        <div className={billModel.allowBlank == 'F'
          ? 'form-input-fill'
          : 'visibleHidden'}>*
        </div>
        <div style={{ flex: 1 }}></div>
      </DatePickerCustom>
    </DatePicker>
  }

  /**
   * 数字类型输入框
   * @returns {*}
   */
  getNumCom (billModel) {
    return <InputItem className='form-input-value' clear
                      placeholder={this.isSelect(billModel)
                        ? '请选择'
                        : ((billModel.readOnly === 'T' ||
                          billModel.editable === 'F')
                          ? ''
                          : '请输入')}
                      editable={(billModel.readOnly === 'T' ||
                        billModel.editable === 'F') ? false : (this.isSelect(
                        billModel)
                        ? false
                        : true)}
      // extra={(billModel.readOnly === 'T' &&
      //   billModel.editable === 'F' && this.isSelect(billModel))
      //   ? '>'
      //   : ''}
                      onChange={this.onTextChange}
                      onClick={this.onInputClick}
                      type={'digit'}
                      value={billModel.getValue()}
    />
  }

  onTextChange = value => {
    const { billModel } = this.state
    billModel.value = value
    this.setState({
      billModel,
    }, () => {
      this.props.onTextChange &&
      this.props.onTextChange(this.props.groupIndex, this.props.childIndex,
        value)
    })
  }

  onInputClick = e => {
    const { billModel } = this.state
    if (this.isSelect(billModel)) {
      if (!isObjEmpty(billModel.localDatas)) {
        this.setState({
          modalList: billModel.localDatas,
          modalOpen: true,
        })
      } else {
        if (this.props.onInputClick) {
          this.props.onInputClick(this.props.groupIndex, this.props.childIndex)
        }
      }
    }
  }

  onModalSelect = index => {
    const { modalList } = this.state
    console.log(modalList)
    if (!isObjEmpty(modalList) && modalList[index] && this.props.onTextChange) {
      this.props.onTextChange(this.props.groupIndex, this.props.childIndex,
        modalList[index].value + '', modalList[index].display + '')
    }
    this.setState({
      modalList: [],
      modalOpen: false,
    })
  }

  onDateChange = date => {
    const { billModel } = this.state
    let dateValue = moment(date)
      .format((billModel.type === 'D' || billModel.type === 'T')
        ? 'YYYY-MM-DD 00:00:00'
        : 'YYYY-MM-DD HH:mm:ss')
    billModel.value = dateValue
    this.setState({
      billModel,
    }, () => {
      this.props.onTextChange &&
      this.props.onTextChange(this.props.groupIndex, this.props.childIndex,
        dateValue)
    })
  }

  isSelect = (billModel) => {
    if (!isObjEmpty(billModel.localDatas)) {
      return true
    }
    let dfType = billModel.type
    if (isObjEmpty(dfType)) {
      return false
    }
    switch (dfType) {
      case 'C':
      case 'D':
      case 'DT':
      case 'MF':
      case 'SF':
      case 'DF':
        // return false
        return true
    }
    return false
  }
}

const DatePickerCustom = ({ extra, onClick, children }) => (
  <div
    onClick={onClick}
    className='form-common-layout'
  >
    {children}
    <span style={{
      float: 'right',
      color: '#888',
      height: '32px',
      lineHeight: '32px',
      paddingRight: '12px',
    }}>{extra}</span>
  </div>
)

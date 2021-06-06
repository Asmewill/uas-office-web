import React, { Component } from 'react'
import './formCommon.less'
import {
  TextareaItem,
  InputItem,
  DatePicker,
  List,
  Modal,
  Checkbox,
  Button,
  DatePickerView,
  Icon,
} from 'antd-mobile'
import {
  formatCurrency,
  isObjEmpty,
  numFormat,
} from '../../../utils/common/common.util'
import moment, { now } from 'moment'
import BillModel, {
  billGetDateRange,
  billGetValue,
  billIsDateRange,
  billIsDateSingle,
  billIsHtml,
  billIsMultiDbfind,
  billIsMultiLine,
  billIsNum,
  billIsSelect,
  billReadOnly,
} from '../../../model/common/BillModel'

/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 通用表单输入框类型
 */

const CheckboxItem = Checkbox.CheckboxItem

export default class FormInput extends Component {

  constructor () {
    super()

    this.state = {
      billModel: new BillModel(),
      modalOpen: false,
      modalList: [],
      dateModalOpen: false,
      dateFrom: '',
      dateTo: '',
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
    if (billIsNum(billModel)) {
      valueItem =
        this.getNumCom(billModel)
    } else if (billIsDateSingle(billModel)) {
      valueItem =
        this.getDateCom(type, billModel)
    } else if (billIsDateRange(billModel)) {
      valueItem =
        this.getDateRangeCom(type, billModel)
    } else if (billIsHtml(billModel)) {
      valueItem =
        this.getHtmlcom(billModel)
    } else {
      valueItem =
        this.getTextCom(billModel)
    }
    return (
      billIsDateSingle(billModel) ? <div>
          {valueItem}
        </div> :
        billIsMultiLine(billModel) ? (this.renderTwoLines(
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
                style={{ minHeight: '46px' }}>
      <div className='form-input-caption'>{billModel.caption}</div>
      <div className={!billModel.allowBlank
        ? 'form-input-fill'
        : 'visibleHidden'}>*
      </div>
      {valueItem}
      {
        (!billReadOnly(billModel) && this.props.showArrow) &&
        <Icon type={'right'} color={'#666666'}/>
      }
      {billIsSelect(billModel) &&
      <Modal
        visible={modalOpen}
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
              billIsMultiDbfind(billModel) ?
                <CheckboxItem
                  checked={modalObj.isSelected}
                  onChange={e => {
                    let checked = e.target.checked
                    modalObj.isSelected = checked
                    modalList[modalObj.index].isSelected = checked
                    this.setState({
                      modalList,
                    })
                  }}
                >
                  {modalObj.value + ''}
                </CheckboxItem> :
                <List.Item
                  key={index}
                  onClick={this.onModalSelect.bind(this,
                    index)}>
                  {modalObj.value + ''}
                </List.Item>
            ))
          )}
        </List>
        {billIsMultiDbfind(billModel) && <Button
          type={'primary'}
          style={{
            margin: '14px 24px',
            height: '36px',
            lineHeight: '36px',
            fontSize: '16px',
          }}
          onClick={this.onDbfindSubmit.bind(this, billModel)}>确定</Button>}
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
    return <div className='form-textarea-layout'>
      <div className='form-common-layout'
           style={{ borderBottom: 'none' }}>
        <div style={{
          minWidth: '90px',
          fontSize: '14px',
          color: '#333333',
        }}>{billModel.caption}</div>
        <div className={!billModel.allowBlank
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
    return <TextareaItem
      className='form-input-value' autoHeight
      placeholder={billReadOnly(billModel)
        ? ''
        : (billIsSelect(billModel)
          ? '请选择'
          : '请输入')}
      clear={true}
      editable={billReadOnly(billModel)
        ? false
        : (billIsSelect(billModel)
          ? false
          : true)}
      disabled={false}
      onChange={this.onTextChange}
      onClick={this.onInputClick}
      value={billGetValue(billModel)}
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
                dangerouslySetInnerHTML={{
                  __html: billGetValue(billModel),
                }}></div>
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
      extra={billReadOnly(billModel) ? ' ' : type === 'DT' ? '选择时间' : '选择日期'}
      disabled={billReadOnly(billModel) ? true : false}
      value={!isObjEmpty(billGetValue(billModel))
        ? new Date(billGetValue(billModel).replace(/\-/g, '/'))
        : ''}
      onChange={this.onDateChange}
    >
      <DatePickerCustom>
        <div className='form-input-caption'>{billModel.caption}</div>
        <div className={!billModel.allowBlank
          ? 'form-input-fill'
          : 'visibleHidden'}>*
        </div>
        <div style={{ flex: 1 }}></div>
      </DatePickerCustom>
    </DatePicker>
  }

  /**
   * 日期区间类型
   * @param type
   * @param billModel
   * @returns {*}
   */
  getDateRangeCom (type, billModel) {
    const { dateModalOpen, dateFrom, dateTo } = this.state
    return <div className='form-input-value'>
      <TextareaItem
        className='form-input-value'
        autoHeight
        placeholder={billReadOnly(billModel)
          ? '' : '选择日期'}
        clear={false}
        editable={false}
        disabled={false}
        onChange={this.onTextChange}
        onClick={this.onInputClick}
        value={billGetDateRange(billModel)}
      />
      <Modal
        visible={dateModalOpen}
        animationType={'slide-up'}
        onClose={() => {
          this.setState({
            dateModalOpen: false,
          })
        }}
        title={billModel.caption}
        popup>
        <div
          style={{
            padding: 6,
            background: 'lightgray',
            color: '#333333',
          }}>开始日期
        </div>
        <DatePickerView
          value={dateFrom ? new Date(dateFrom.replace(/\-/g, '/')) : new Date()}
          mode={billModel.type === 'YM' ? 'month' : 'date'}
          onChange={this.onFromDateChange}
          minDate={new Date('2000-01-01')}
          maxDate={new Date('2050-01-01')}
        />
        <div
          style={{
            padding: 6,
            background: 'lightgray',
            color: '#333333',
          }}>结束日期
        </div>
        <DatePickerView
          value={dateTo ? new Date(dateTo.replace(/\-/g, '/')) : new Date()}
          mode={billModel.type === 'YM' ? 'month' : 'date'}
          onChange={this.onToDateChange}
          minDate={new Date('2000-01-01')}
          maxDate={new Date('2050-01-01')}
        />
        <div className='form-common-modal-func'>
          <Button
            className='form-common-modal-func-button'
            type="primary"
            onClick={() => {
              const { dateFrom, dateTo } = this.state
              const value = {
                from: dateFrom,
                to: dateTo,
              }
              this.props.onTextChange &&
              this.props.onTextChange(this.props.groupIndex,
                this.props.childIndex,
                value)
              this.setState({
                dateModalOpen: false,
              })
            }}
            inline>确认</Button>
          <Button
            className='form-common-modal-func-button'
            type="ghost"
            onClick={() => {
              this.setState({
                dateModalOpen: false,
              })
            }}
            inline>取消</Button>
        </div>
      </Modal>
    </div>
  }

  /**
   * 选择开始日期
   * @param date
   */
  onFromDateChange = (date) => {
    const { billModel } = this.state
    let dateFrom = moment(date).format(billModel.type === 'YM'
      ? 'YYYY-MM'
      : 'YYYY-MM-DD')
    this.setState({
      dateFrom,
    })
  }

  /**
   * 选择结束日期
   * @param date
   */
  onToDateChange = (date) => {
    const { billModel } = this.state
    let dateTo = moment(date).format(billModel.type === 'YM'
      ? 'YYYY-MM'
      : 'YYYY-MM-DD')
    this.setState({
      dateTo,
    })
  }

  /**
   * 数字类型输入框
   * @returns {*}
   */
  getNumCom (billModel) {
    let caption = billModel.caption
    let value = billGetValue(billModel)
    if (billModel.format) {
      value = formatCurrency(value, parseInt(billModel.format))
    }
    return <InputItem
      className='form-input-value' clear
      placeholder={billReadOnly(billModel)
        ? ''
        : (billIsSelect(billModel)
          ? '请选择'
          : '请输入')}
      editable={billReadOnly(billModel) ? false : (billIsSelect(
        billModel)
        ? false
        : true)}
      onChange={this.onTextChange}
      onClick={this.onInputClick}
      type={'digit'}
      value={(billReadOnly(billModel)
        && !isObjEmpty(caption)
        && !caption.toLowerCase().endsWith('id'))
        ? numFormat(value)
        : value}
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
    console.log(billModel)
    if (billIsSelect(billModel) && !billModel.readOnly) {
      if (billIsDateRange(billModel)) {
        this.setState({
          dateFrom: (!isObjEmpty(billModel.value) &&
            !isObjEmpty(billModel.value.from))
            ? billModel.value.from
            : moment(now()).format(billModel.type === 'YM'
              ? 'YYYY-MM'
              : 'YYYY-MM-DD'),
          dateTo: (!isObjEmpty(billModel.value) &&
            !isObjEmpty(billModel.value.to))
            ? billModel.value.to
            : moment(now()).format(billModel.type === 'YM'
              ? 'YYYY-MM'
              : 'YYYY-MM-DD'),
          dateModalOpen: true,
        })
      } else if (!isObjEmpty(billModel.localDatas)) {
        billModel.localDatas.forEach((item, index) => {
          item.isSelected = false
          item.index = index

          if (billIsMultiDbfind(billModel) && !isObjEmpty(billModel.value)) {
            const billValue = billModel.value
            let valueArray = billValue.split('#')
            if (valueArray.indexOf(item.value) > -1) {
              item.isSelected = true
            }
          }
        })
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

  /**
   * 多选本地数据确认
   */
  onDbfindSubmit = (selectModel) => {
    const { modalList } = this.state
    let selectValue = '', selectDisplay = ''
    modalList.forEach((item, index) => {
      if (item.isSelected) {
        if (isObjEmpty(selectValue)) {
          selectValue = item.value
          selectDisplay = item.display
        } else {
          selectValue += ('#' + item.value)
          selectDisplay += ('#' + item.display)
        }
      }
    })
    this.props.onTextChange &&
    this.props.onTextChange(this.props.groupIndex, this.props.childIndex,
      selectValue, selectDisplay)
    this.setState({
      modalList: [],
      modalOpen: false,
    })
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
    let dateValue = moment(date).
      format((billModel.type === 'D' || billModel.type === 'T')
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
}

/**
 * 日期选择框自定义布局
 * @param extra
 * @param onClick
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
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

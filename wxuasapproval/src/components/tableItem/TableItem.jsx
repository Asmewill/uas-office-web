import React, { Component } from 'react'
import './tableItem.css'
import { Input, Modal } from 'semantic-ui-react'
import { DatePicker, Radio } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { isObjEmpty, numFormat, strContain } from '../../utils/common'
import ApprovalBean from '../../model/ApprovalBean'
import moment from 'moment'

const RadioGroup = Radio.Group

export default class TableItem extends Component {

  componentDidMount () {
    let { mApproval } = this.state

    this.setState({
      mApproval: this.props.approval,
      approvalAble: this.props.approvalAble,
    })
    let options = []
    let datas = mApproval.datas
    if (!isObjEmpty(datas)) {
      for (let i = 0; i < datas.length; i++) {
        options.push(datas[i].display)
      }
    }
    this.setState({
      selectList: options,
      inputValue: mApproval.values,
    })
    let values = mApproval.values
    if (values == ApprovalBean.VALUES_YES
      || values == '0') {
      this.setState({
        radioValue: 1,
      })
    } else if (values == ApprovalBean.VALUES_NO) {
      this.setState({
        radioValue: 2,
      })
    }
  }

  componentWillReceiveProps () {
    this.componentDidMount()
  }

  constructor () {
    super()

    this.state = {
      modalOpen: false,
      selectList: [],
      inputValue: '',
      radioValue: 1,
      mApproval: new ApprovalBean(),
      approvalAble: true,//审批状态
    }
  }

  render () {
    let valueItem = ''
    const dateFormat = 'YYYY-MM-DD'
    const { inputValue, radioValue, selectList, mApproval, approvalAble } = this.state

    if (approvalAble == false) {
      if (mApproval.dfType == 'N'
        || mApproval.dfType == 'floatcolumn8'
        || mApproval.dfType == 'SN'
        || strContain(mApproval.dfType, 'floatcolumn')) {
        valueItem =
          <div>{numFormat(mApproval.values)}</div>
      } else {
        valueItem =
          <div dangerouslySetInnerHTML={{ __html: mApproval.values }}></div>
      }
    } else if (mApproval.neerInput) {
      let placeHolder = ''
      if (mApproval.mustInput) {
        if (mApproval.inputType() == 2 || mApproval.inputType() == 3 ||
          mApproval.inputType() == 4) {
          placeHolder = '请选择(必选)'
        } else {
          placeHolder = '请输入(必填)'
        }
      } else {
        if (mApproval.inputType() == 2 || mApproval.inputType() == 3 ||
          mApproval.inputType() == 4) {
          placeHolder = '请选择(非必选)'
        } else {
          placeHolder = '请输入(非必填)'
        }
      }
      switch (mApproval.inputType()) {
        case 0:
          //字符输入
          valueItem = <Input className='value-input' placeholder={placeHolder}
                             value={inputValue} onChange={this.inputChange}/>
          break
        case 1:
          //数字输入
          valueItem = <Input type='number' onKeyPress={this.numKeyPress}
                             className='value-input' placeholder={placeHolder}
                             value={inputValue} onChange={this.inputChange}/>
          break
        case 2:
          //日期选择框
          let defaultDate = inputValue
          if (!isObjEmpty(inputValue)) {
            defaultDate = ''
          } else {
            defaultDate = moment(defaultDate, 'YYYY-MM-DD')
            if (!defaultDate._isValid) {
              defaultDate = ''
            }
          }
          valueItem = <DatePicker locale={locale} className='value-input'
                                  defaultValue={defaultDate}
                                  placeholder={placeHolder}
                                  format={dateFormat} size='small'
                                  onChange={this.onDatePicker}/>
          break
        case 3:
          //弹框选择
          const { modalOpen } = this.state
          let modalItems = []
          for (let i = 0; i < selectList.length; i++) {
            modalItems.push(<div className='selectItem' onClick={
              this.modalSelect.bind(this, i)
            }>{selectList[i]}</div>)
          }
          valueItem = <Modal trigger={<Input className='value-input'
                                             readOnly unselectable='on'
                                             placeholder={placeHolder}
                                             onClick={this.onSelectClick}
                                             value={inputValue}/>}
                             open={modalOpen}
                             onClose={this.modalClose}
                             size='small'>
            <Modal.Content image>
              <Modal.Description>
                {modalItems}
              </Modal.Description>
            </Modal.Content>
          </Modal>

          break
        case 4:
          //dbfind
          valueItem = <Input className='value-input'
                             readOnly unselectable='on'
                             placeholder={placeHolder}
                             onClick={this.onDbfindClick}
                             value={inputValue}/>
          break
        case 5:
          valueItem =
            <RadioGroup onChange={this.onRadioChange} value={radioValue}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </RadioGroup>
          break
        default:
          valueItem = <div></div>
          break
      }
    } else {
      let oldValues = mApproval.oldValues
      if (!isObjEmpty(oldValues)) {
        valueItem = <div className='oldNewLayout'>
          <span style={{ textDecoration: 'line-through' }}>{oldValues}</span>
          <span style={{ color: '#f10813' }}>{mApproval.values}</span>
        </div>
      } else {
        if (mApproval.dfType == 'N'
          || mApproval.dfType == 'floatcolumn8'
          || mApproval.dfType == 'SN'
          || strContain(mApproval.dfType, 'floatcolumn')) {
          valueItem =
            <div>{numFormat(mApproval.values)}</div>
        } else {
          valueItem =
            <div dangerouslySetInnerHTML={{ __html: mApproval.values }}></div>
        }
      }
    }

    return <div className='table-parent'>
      <div className='table-caption'>{mApproval.caption}</div>
      <div className='table-value'>
        {valueItem}
      </div>
    </div>
  }

  onRadioChange = (e) => {
    let value = e.target.value
    this.setState({
      radioValue: value,
    })
    if (value == 1) {
      this.props.valueListener(this.props.approval.type, this.props.index,
        ApprovalBean.VALUES_YES, false)
    } else {
      this.props.valueListener(this.props.approval.type, this.props.index,
        ApprovalBean.VALUES_NO, false)
    }
  }

  numKeyPress = (event) => {
    const invalidChars = ['-', '+', 'e', '.', 'E']
    if (invalidChars.indexOf(event.key) !== -1) {
      event.preventDefault()
    }
  }

  modalClose = () => {
    this.setState({
      modalOpen: false,
    })
  }

  modalSelect = (index) => {
    const { selectList } = this.state
    this.setState({
      inputValue: selectList[index],
      modalOpen: false,
    }, () => {
      this.props.valueListener(this.props.approval.type, this.props.index,
        this.state.inputValue, false)
    })
  }

  inputChange = (e) => {
    this.setState({
      inputValue: e.target.value,
    }, () => {
      this.props.valueListener(this.props.approval.type, this.props.index,
        this.state.inputValue, false)
    })

  }

  onDatePicker = (e, dateString) => {
    this.setState({
      inputValue: dateString,
    }, () => {
      this.props.valueListener(this.props.approval.type, this.props.index,
        this.state.inputValue, false)
    })
  }

  onSelectClick = () => {
    this.setState({
      modalOpen: true,
    })
  }

  onDbfindClick = () => {
    if (this.props.onDbfindClick) {
      this.props.onDbfindClick(this.props.approval.type, this.props.index)
    }
  }
}

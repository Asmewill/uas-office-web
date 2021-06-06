import React, { Component } from 'react'
import './pointsItem.css'
import { Icon, Modal } from 'semantic-ui-react'
import { DatePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { isObjEmpty } from '../../utils/common'
import ApprovalBean from '../../model/ApprovalBean'
import moment from 'moment'

export default class PointsItem extends Component {

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
      mApproval: new ApprovalBean(),
      approvalAble: true,
    }
  }

  render () {
    let valueItem = ''
    const dateFormat = 'YYYY-MM-DD'
    const { inputValue, selectList, mApproval, approvalAble } = this.state

    if (approvalAble == false) {
      valueItem = <div className='value-input'>{mApproval.values}</div>
    } else if (mApproval.isSelect()) {
      let placeHolder = ''
      if (mApproval.mustInput) {
        placeHolder = '请选择(必选)'
      } else {
        placeHolder = '请选择(非必选)'
      }
      if (mApproval.inputType() == 2) {
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
        valueItem = <div style={{ display: 'flex' }}>
          <DatePicker locale={locale} className='date-input'
                      defaultValue={defaultDate}
                      format={dateFormat} size='small'
                      placeholder={placeHolder}
                      onChange={this.onDatePicker}
                      suffixIcon=' '/>
          <Icon name='angle right' style={{ margin: '0px', padding: '0px' }}/>
        </div>
      } else {
        //弹框选择
        const { modalOpen } = this.state
        let modalItems = []
        for (let i = 0; i < selectList.length; i++) {
          modalItems.push(<div className='selectItem' onClick={
            this.modalSelect.bind(this, i)
          }>{selectList[i]}</div>)
        }
        valueItem = <Modal trigger={<div style={{ display: 'flex' }}
                                         onClick={this.onSelectClick}>
          <input placeholder={placeHolder} readOnly unselectable='on'
                 className='value-input'
                 value={inputValue}/>
          <Icon name='angle right' style={{ margin: '0px', padding: '0px' }}/>
        </div>}
                           open={modalOpen}
                           onClose={this.modalClose}
                           size='small'>
          <Modal.Content image>
            <Modal.Description>
              {modalItems}
            </Modal.Description>
          </Modal.Content>
        </Modal>

      }
    } else {
      let placeHolder = ''
      if (mApproval.mustInput) {
        placeHolder = '请输入(必填)'
      } else {
        placeHolder = '请输入(非必填)'
      }
      if (mApproval.dfType == 'N') {
        //数字输入框
        valueItem = <div style={{ display: 'flex' }}>
          <input type='number' onKeyPress={this.numKeyPress}
                 placeholder={placeHolder} className='value-input'
                 value={inputValue} onChange={this.inputChange}/>
          <Icon name='angle right' style={{
            margin: '0px',
            padding: '0px',
            visibility: 'hidden',
          }}/>
        </div>
      } else {
        //文本输入框
        valueItem = <div style={{ display: 'flex' }}>
          <input placeholder={placeHolder} className='value-input'
                 value={inputValue} onChange={this.inputChange}/>
          <Icon name='angle right' style={{
            margin: '0px',
            padding: '0px',
            visibility: 'hidden',
          }}/>
        </div>
      }
    }
    /*switch (this.props.type) {
        case '1':
            //输入框
            valueItem = <div style={{display: 'flex'}}>
                <input placeholder='请输入' className='value-input'
                       value={inputValue} onChange={this.inputChange}/>
                <Icon name='angle right' style={{margin: '0px', padding: '0px', visibility: 'hidden'}}/>
            </div>
            break
        case '2':
            //日期选择框
            valueItem = <div style={{display: 'flex'}}>
                <DatePicker locale={locale} className='date-input'
                            defaultValue={inputValue}
                            format={dateFormat} size='small'
                            onChange={this.onDatePicker}
                            suffixIcon=' '/>
                <Icon name='angle right' style={{margin: '0px', padding: '0px'}}/>
            </div>
            break
        case '3':
            //弹框选择
            const {modalOpen, selectList} = this.state
            let modalItems = []
            for (let i = 0; i < selectList.length; i++) {
                modalItems.push(<div className='selectItem' onClick={
                    this.modalSelect.bind(this, i)
                }>{selectList[i]}</div>)
            }
            valueItem = <Modal trigger={<div style={{display: 'flex'}} onClick={this.onSelectClick}>
                <input placeholder='请选择' readOnly unselectable='on'
                       className='value-input'
                       value={inputValue}/>
                <Icon name='angle right' style={{margin: '0px', padding: '0px'}}/>
            </div>}
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
        default:
            valueItem = <div></div>
            break
    }*/

    return <div style={{ padding: '4px' }}>
      <div className='points-parent'>
        <div className='points-caption'>{mApproval.caption}</div>
        <div className='points-value'>
          {valueItem}
        </div>
      </div>
    </div>

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
}

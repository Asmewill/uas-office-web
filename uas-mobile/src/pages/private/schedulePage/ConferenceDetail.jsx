/**
 * Created by Hujs on 2020/12/28
 * Desc: 会议详情
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Button, Modal } from 'antd-mobile'
import { message } from 'antd'
import { isObjEmpty } from '../../../utils/common/common.util'
import { API } from '../../../configs/api.config'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import CurrencyDetail
  from '../../../components/common/currencyDetail/CurrencyDetail'
import FormInput from '../../../components/common/formNew/FormInput'
import './conference-detail.less'

const Item = List.Item

class ConferenceDetail extends Component {

  constructor () {
    super()

    this.state = {
      openModal: false,
      billModel: {
        type: 'DF',
        caption: '与会人员',
        value: '',
        allowBlank: true,
        readyOnly: false,
      },
      isCheck: true,
      agreedList: [],
    }
  }

  componentDidMount () {
    const title = this.props.match.params.title
    document.title = title || '会议详情'
    this.getAgreedData()
  }

  componentWillUnmount () {

  }

  render () {
    let { billModel, openModal, agreedList, isCheck } = this.state

    let showDetailList = []
    if (!isObjEmpty(agreedList)) {
      agreedList.forEach((item, index) => {
        showDetailList.push(
          <Item
            extra={item.STATUS == -1 ? '已接受' : ''}
            key={index}
          >
            {item.NAME}
          </Item>,
        )
      })
    }
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <CurrencyDetail
          onRef={el => this.cd = el}
          caller={this.props.match.params.caller}
          id={this.props.match.params.id}
          isDetail
          onDataLoadComplete={this.onDataLoadComplete.bind(this)}
        >
          <FormInput
            billModel={billModel}
            onInputClick={this.onInputClick.bind(this)}
            showArrow/>
        </CurrencyDetail>

        <Modal
          popup
          visible={openModal}
          onClose={this.onClose}
          animationType="slide-up"
          className="show-detail"
        >
          {
            showDetailList
          }
        </Modal>

        {
          isCheck ? null : (
            <Button
              style={{
                margin: '16px 24px',
              }}
              type="primary"
              onClick={this.onAccept}
              inline>接受</Button>
          )
        }

      </div>

    )
  }

  onDataLoadComplete = (billGroupList) => {
    if (billGroupList && billGroupList[0] && billGroupList[0].showBillFields) {
      for (let index = 0; index <
      billGroupList[0].showBillFields.length; index++) {
        const item = billGroupList[0].showBillFields[index]
        if (item.caption === '与会人员' || item.caption === '参会人员') {
          billGroupList[0].showBillFields.splice(index, 1)
          break
        }
      }
      this.cd.setState({
        billGroupList,
      })
    }
  }

  //获取数据
  getAgreedData = () => {
    fetchPostObj(API.APPCOMMON_CONFERENCEDETAIL, {
      id: this.props.match.params.id,
    }).then(response => {
      this.setState({
        agreedList: response.data.list,
        isCheck: response.data.isCheck,
      }, () => {
        let { agreedList, billModel } = this.state
        let str = ''
        if (agreedList.length < 8) {
          agreedList.forEach((item, index) => {
            let right = item.STATUS == -1 ? '√' : ''
            str += item.NAME + right + '，'
          })
          str = str.slice(0, str.length - 1)
        } else {
          let sliceArr = agreedList.slice(0, 7)
          sliceArr.forEach((item, index) => {
            let right = item.STATUS == -1 ? '√' : ''
            str += item.NAME + right + '，'
          })
          str = str.slice(0, str.length - 1) + '等' + agreedList.length + '人'
        }
        billModel.value = str
        this.setState({
          billModel,
        })
      })
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('用户确认数据失败')
      }
    })

  }

  //接受会议
  onAccept = () => {
    fetchPostObj(API.APPCOMMON_CONFERENCECONFIRM, {
      id: this.props.match.params.id,
    }).then(response => {
      this.getAgreedData()
      this.setState({
        isCheck: true,
      })
      message.success('确认成功')
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('确认失败')
      }
    })
  }

  onInputClick = () => {
    this.setState({ openModal: true })
  }

  onClose = () => {
    this.setState({
      openModal: false,
    })
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(ConferenceDetail)

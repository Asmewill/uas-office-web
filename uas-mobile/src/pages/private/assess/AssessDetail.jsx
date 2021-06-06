/**
 * Created by RaoMeng on 2021/3/29
 * Desc: 考核评估详情
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyDetail
  from '../../../components/common/currencyDetail/CurrencyDetail'
import { isObjNull } from '../../../utils/common/common.util'
import { API } from '../../../configs/api.config'

let mCaller//当前单据的Caller
let mId

class AssessDetail extends Component {

  constructor () {
    super()

    this.state = {
      submitAble: false,
    }
  }

  componentDidMount () {
    const title = this.props.match.params.title
    mId = this.props.match.params.id
    mCaller = this.props.match.params.caller
    document.title = title || '单据详情'
  }

  componentWillUnmount () {

  }

  render () {
    const { submitAble } = this.state
    return (
      <CurrencyDetail
        onRef={ref => this.cd = ref}
        caller={this.props.match.params.caller}
        id={this.props.match.params.id}
        isDetail={!submitAble}
        promptAble={'F'}
        submitUrl={API.KPI_UPDATEANDSUBMITKPIBILL}
        submitSuccess={this.submitSuccess.bind(this)}
        onDataLoadComplete={this.onDataLoadComplete.bind(this)}
      />
    )
  }

  submitSuccess = (keyValue) => {
    this.props.history.replace(
      '/assessDetail/' + keyValue + '/' + this.props.match.params.caller +
      '/' + this.props.match.params.title,
    )
    this.setState({
      submitAble: false,
    })
    this.cd.componentDidMount()
  }

  onDataLoadComplete = (billGroupList) => {
    if (billGroupList) {
      let statusCode = undefined
      for (let gi = 0; gi < billGroupList.length; gi++) {
        if (!isObjNull(statusCode)) {
          break
        }
        const billGroup = billGroupList[gi]
        if (billGroup) {
          let showBillFields = billGroup.showBillFields
          let hideBillFields = billGroup.hideBillFields
          if (showBillFields) {
            for (let i = 0; i < showBillFields.length; i++) {
              const showField = showBillFields[i]
              if (showField && (showField.field === 'kb_statuscode')) {
                statusCode = showField.value
                break
              }
            }
          }

          if (isObjNull(statusCode) && hideBillFields) {
            for (let i = 0; i < hideBillFields.length; i++) {
              const hideField = hideBillFields[i]
              if (hideField && (hideField.field === 'kb_statuscode')) {
                statusCode = hideField.value
                break
              }
            }
          }
        }
      }
      billGroupList.forEach(billGroup => {
        let showBillFields = billGroup.showBillFields
        let hideBillFields = billGroup.hideBillFields
        if (showBillFields) {
          showBillFields.forEach(showField => {
            showField.readOnly = statusCode !== 'ENTERING'
            showField.allowBlank = showField.allowBlankReal ||
              (statusCode !== 'ENTERING')
          })
        }
        if (hideBillFields) {
          hideBillFields.forEach(hideField => {
            hideField.readOnly = statusCode !== 'ENTERING'
            hideField.allowBlank = hideField.allowBlankReal ||
              (statusCode !== 'ENTERING')
          })
        }
      })
      this.cd.setState({
        billGroupList,
      })

      this.setState({
        submitAble: statusCode === 'ENTERING',
      })
    }
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(AssessDetail)

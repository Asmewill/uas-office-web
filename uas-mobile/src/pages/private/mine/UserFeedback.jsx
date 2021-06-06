/**
 * Created by Hujs on 2020/12/25
 * Desc: 用户反馈
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, TextareaItem } from 'antd-mobile'
import { message } from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { _baseURL, API } from '../../../configs/api.config'
import FormEnclosure from '../../../components/common/formNew/FormEnclosure'
import './user-feedback.less'

class UserFeedback extends Component {

  constructor () {
    super()

    this.state = {
      inputValue: '',
      accessoryValue: '',
      loading: false,
      billModel: {
        type: 'FF',
        caption: '附件',
        value: '',
        allowBlank: true,
      },
    }
  }

  componentDidMount () {
    document.title = this.title || '用户反馈'
  }

  componentWillUnmount () {

  }

  render () {
    const { billModel } = this.state
    return (
      <div className="user-feedback">
        <div className="feedback-input-panel">
          <EditOutlined/> 反馈信息
          <TextareaItem
            rows={4}
            placeholder="请输入您的问题...(400字以内)"
            onChange={this.onInfoChange}
          />
        </div>
        <FormEnclosure
          billModel={billModel}
          baseUrl={_baseURL}
          onTextChange={this.onAccessoryChange}
          beforeUpload={this.beforeUpload}
        />


        <div className="feedback-btn-panel">
          <Button
            className='feedback-btn-panel-button'
            type="primary"
            onClick={this.onCommit}
            inline>提交</Button>
        </div>
      </div>
    )
  }

  onAccessoryChange = (groupIndex, childIndex, value) => {
    this.setState({
      accessoryValue: value,
    })
  }

  //提交
  onCommit = () => {
    let { inputValue, accessoryValue } = this.state
    if (inputValue == '' && accessoryValue == '') {
      message.error('请填写反馈内容或上传附件')
      return false
    }
    fetchPostObj(API.COMMON_POSTFEEDBACK, {
      cf_description: inputValue,
      cf_attach: accessoryValue,
    }).then(response => {
      if (response.success) {
        message.success('提交成功')
      }
    }).catch(error => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('反馈提交失败')
      }
    })
  }

  //反馈内容
  onInfoChange = (val) => {
    this.setState({
      inputValue: val,
    })
  }

}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(UserFeedback)

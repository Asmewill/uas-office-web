/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 通用表单附件类型
 */

import React, { Component } from 'react'
import './formCommon.less'
import { Upload } from 'antd'
import {
  getBracketStr,
  isObjEmpty,
  isObjNull,
} from '../../../utils/common/common.util'
import { Toast } from 'antd-mobile'
import { UploadOutlined } from '@ant-design/icons'
import BillModel, { billReadOnly } from '../../../model/common/BillModel'
import store from '../../../redux/store/store'

let uploadFail = false

export default class FormEnclosure extends Component {

  constructor () {
    super()
    this.state = {
      billModel: new BillModel(),
    }
  }

  componentDidMount () {
    let { billModel } = this.props

    this.setState({
      billModel: billModel,
    })
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps () {
    this.componentDidMount()
  }

  render () {
    const { billModel } = this.state

    let valueItem = this.getEnclosureCom(billModel)
    return (valueItem)
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
        <div className={!billModel.allowBlank
          ? 'form-input-fill'
          : 'visibleHidden'}>*
        </div>
      </div>
      {valueItem}
    </div>
  }

  /**
   * 附件类型
   * @param billModel
   */
  getEnclosureCom = (billModel) => {
    return <Upload
      action={this.props.baseUrl + '/mobile/uploadAttachs.action'}
      listType={'picture'}
      multiple={true}
      disabled={billReadOnly(billModel)}
      fileList={billModel.fileList ? billModel.fileList : []}
      showUploadList={true}
      withCredentials={true}
      beforeUpload={this.beforeUpload}
      onChange={this.handleChange}
      // onPreview={this.handlePreview}
      onRemove={this.handleRemove}
      // onDownload={() => {}}
      // data={''}
      method={'post'}
      className={'upload-list-inline'}
    >
      <div className='form-common-layout'
           style={{
             borderBottom: 'none',
             width: '100vw',
           }}>
        <div style={{
          display: 'flex',
          flex: 1,
        }}>
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

        {
          billReadOnly(billModel) ||
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={'uploadBtn'}>
              <UploadOutlined
                style={{ color: 'white' }}/>
              <span
                style={{ fontSize: '12px', marginLeft: '6px' }}>选择文件</span>
            </div>
            <span className='promptText'>（不能超过100MB）</span>
          </div>
        }
      </div>
    </Upload>
  }

  handleChange = ({ fileList }) => {
    if (uploadFail) {
      return
    }
    const { count, onTextChange, groupIndex, childIndex } = this.props
    const { billModel } = this.state
    if (isObjNull(count) || fileList.length <= count) {
      //{"success":true,"id":"[52650]"}
      let value = ''
      if (fileList) {
        fileList.forEach((file, index) => {
          file.enclosureId = (file.response && file.response.id)
            ? getBracketStr(file.response.id)
            : file.enclosureId
          if (file.enclosureId) {
            value = value + file.enclosureId + ';'
            if (isObjEmpty(file.url)) {
              file.url = this.props.baseUrl +
                '/common/downloadbyId.action?id=' +
                file.enclosureId
                + '&master=' + store.getState().userState.accountCode
            }
          }
        })
      }
      console.log(fileList)
      billModel.fileList = fileList
      this.setState({ billModel })
      onTextChange && onTextChange(groupIndex, childIndex, value)
    }
  }

  handleRemove = (file) => {
    if (this.props.handleRemove) {
      return this.props.handleRemove(file)
    }
  }

  beforeUpload = (file, fileList) => {
    uploadFail = false
    if (file.size && file.size > 100 * 1024 * 1024) {
      uploadFail = true
      Toast.fail('文件大小不能超过100M')
      return false
    }
    const { count } = this.props
    const { billModel } = this.state
    if (count && billModel.fileList &&
      ((billModel.fileList.length + fileList.length) > count)) {
      Toast.fail(`上传失败，附件数量不能超过${count}`)
      uploadFail = true
      return false
    } else {
      return this.props.beforeUpload
        ? this.props.beforeUpload(file, fileList)
        : true
    }
  }

  handlePreview = (file) => {

  }

}

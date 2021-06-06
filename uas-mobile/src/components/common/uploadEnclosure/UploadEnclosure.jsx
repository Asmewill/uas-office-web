/**
 * Created by RaoMeng on 2018/11/7
 * Desc: 图片上传组件
 */

import React, { Component } from 'react'
import { Upload } from 'antd'
import { Toast } from 'antd-mobile'
import { PlusOutlined } from '@ant-design/icons'
import { isObjEmpty } from '../../../utils/common/common.util'
import ImagesViewer from '../imagesVIewer'
import PropTypes from 'prop-types'
import 'src/components/common/uploadEnclosure/upload.less'

let uploadFail = false
export default class UploadEnclosure extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,//上传地址
    data: PropTypes.object,//上传所需参数
    headers: PropTypes.object,//上传所需头部参数
    accept: PropTypes.string,//接受上传的文件类型
    listType: PropTypes.string,//附件列表格式，默认picture-card
    count: PropTypes.number,//附件限制数量，默认为1
    multiple: PropTypes.bool,//是非支持多选，默认为false
    title: PropTypes.string,//title，默认为‘附件’
    needPoint: PropTypes.bool,//是非需要下方的指示点，默认为true
    beforeUpload: PropTypes.func,//上传附件前的回调花事件
    handleChange: PropTypes.func,//附件选择后的回调
    handlePreview: PropTypes.func,//附件预览（一般情况下不传）
    limit: PropTypes.bool,//是否限制附件个数
    handleRemove: PropTypes.func,//移除照片的回调
  }

  static defaultProps = {
    listType: 'picture-card',
    count: 1,
    data: {
      folderId: 0,
    },
    headers: {},
    multiple: false,
    title: '附件',
    needPoint: true,
    limit: true,
    accept: 'image/*',
  }

  constructor () {
    super()

    this.state = {
      previewVisible: false,
      previewIndex: 0,
      fileList: [],
    }
  }

  componentDidMount () {
    this.setState({
      fileList: this.props.fileList,
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      fileList: nextProps.fileList,
    })
  }

  render () {
    const { fileList } = this.state
    const {
      action, listType, count, multiple,
      title, needPoint, limit, accept, data, headers,
    } = this.props

    const imgs = []
    if (!isObjEmpty(fileList) && fileList !== '[]') {
      for (let i = 0; i < fileList.length; i++) {
        imgs.push(fileList[i].url || fileList[i].thumbUrl)
      }
    }

    let pointAble = needPoint
    if (imgs.length > 9) {
      pointAble = false
    }
    // const userInfo = store.getState().redUserInfo

    const headerParams = {
      // headers?...headers:{},
      // 'Authorization': userInfo.token,
      ...headers,
    }

    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    return (
      <div style={{ width: '100%' }} className='upload-enclosure-root'>
        <div className='chooseLayout'>
          <span className='annexText'>{title}</span>
          {limit ? <span
            className='annexCount'>（{fileList.length}/{count}）张</span> : ''}
        </div>
        <div className='imagesLayout'>
          <Upload
            action={action}
            accept={accept}
            data={data}
            listType={listType}
            fileList={fileList}
            multiple={multiple}
            withCredentials={true}
            headers={headerParams}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove}>
            {(fileList.length >= count && limit) ? '' : uploadButton}
          </Upload>
          {this.state.previewVisible ?
            <ImagesViewer onClose={this.handleCancel} urls={imgs}
                          index={this.state.previewIndex}
                          needPoint={pointAble}/> : ''}
        </div>
      </div>
    )
  }

  beforeUpload = (file, fileList) => {
    uploadFail = false
    const { count, limit } = this.props
    console.log('fileListb', fileList)
    if (this.state.fileList.length + fileList.length > count && limit) {
      Toast.fail(`上传失败，附件数量不能超过${count}张`)
      uploadFail = true
      return false
    } else {
      return this.props.beforeUpload(file, fileList)
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    if (this.props.handlePreview) {
      this.props.handlePreview(file)
    } else {
      this.setState({
        previewVisible: true,
        previewIndex: file.index || 0,
      })
    }
  }

  handleChange = ({ fileList }) => {
    console.log('filelist', fileList)
    if (uploadFail) {
      return
    }
    if (fileList.length <= this.props.count || !this.props.limit) {
      if (fileList) {
        fileList.forEach((value, index) => {
          value.url = (value.response && value.response.data)
            ? value.response.data.accessPath
            : value.url
          value.picUrl = value.url
          value.relativeUrl = (value.response && value.response.data)
            ? value.response.data.fullPath
            : value.relativeUrl
        })
      }

      this.setState({ fileList })
      this.props.handleChange(fileList)
    }
  }

  handleRemove = (file) => {
    if (this.props.handleRemove) {
      return this.props.handleRemove(file)
    }
  }
}
